<?php
/**
 * Plugin Name: {name}
 * Plugin URI:  https://example.com/plugins/{name}
 * Description: A powerful plugin for managing custom content with shortcodes, widgets, and admin tools.
 * Version:     1.0.0
 * Author:      {name} Team
 * Text Domain: {name}
 * Domain Path: /languages
 */

defined('ABSPATH') || exit;

final class {name}_Plugin {

    private static ?{name}_Plugin $instance = null;
    private string $plugin_path;
    private string $plugin_url;

    public static function init(): {name}_Plugin {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->plugin_path = plugin_dir_path(__FILE__);
        $this->plugin_url  = plugin_dir_url(__FILE__);

        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        add_action('init', [$this, 'register_post_types']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_shortcode('{name}', [$this, 'render_shortcode']);
        add_filter('the_content', [$this, 'filter_content']);
        add_action('widgets_init', [$this, 'register_widget']);
    }

    public function activate(): void {
        if (!current_user_can('activate_plugins')) {
            return;
        }
        $this->register_post_types();
        flush_rewrite_rules();
        add_option('{name}_version', '1.0.0');
        update_option('{name}_installed_at', current_time('mysql'));

        $defaults = [
            '{name}_setting_color' => '#0073aa',
            '{name}_setting_limit' => 10,
        ];
        foreach ($defaults as $key => $value) {
            if (get_option($key) === false) {
                add_option($key, $value);
            }
        }
    }

    public function deactivate(): void {
        if (!current_user_can('activate_plugins')) {
            return;
        }
        flush_rewrite_rules();
    }

    public function register_post_types(): void {
        register_post_type('{name}_item', [
            'labels' => [
                'name'          => __('{name} Items', '{name}'),
                'singular_name' => __('{name} Item', '{name}'),
                'add_new_item'  => __('Add New Item', '{name}'),
                'edit_item'     => __('Edit Item', '{name}'),
                'view_item'     => __('View Item', '{name}'),
            ],
            'public'       => true,
            'has_archive'  => true,
            'supports'     => ['title', 'editor', 'thumbnail'],
            'menu_icon'    => 'dashicons-admin-generic',
            'show_in_rest' => true,
        ]);
    }

    public function add_admin_menu(): void {
        $capability = 'manage_options';

        add_menu_page(
            __('{name}', '{name}'),
            __('{name}', '{name}'),
            $capability,
            '{name}',
            [$this, 'render_admin_page'],
            'dashicons-admin-generic',
            30
        );

        add_submenu_page(
            '{name}',
            __('Settings', '{name}'),
            __('Settings', '{name}'),
            $capability,
            '{name}_settings',
            [$this, 'render_settings_page']
        );
    }

    public function render_admin_page(): void {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions.', '{name}'));
        }
        ?>
        <div class="wrap">
            <h1><?php echo esc_html__('{name} Dashboard', '{name}'); ?></h1>
            <div class="notice notice-info">
                <p><?php echo esc_html__('Welcome to {name}! Use the shortcode', '{name}); ?>
                <code>[{name}]</code>
                <?php echo esc_html__('to display items on your site.', '{name}'); ?></p>
            </div>
            <?php
            $items = wp_count_posts('{name}_item');
            $published = $items->publish ?? 0;
            $drafts = $items->draft ?? 0;
            ?>
            <div style="display:flex;gap:20px;margin-top:20px;">
                <div style="background:#fff;padding:20px;border:1px solid #ccc;flex:1;text-align:center;">
                    <h3><?php echo esc_html__('Published Items', '{name}'); ?></h3>
                    <p style="font-size:2em;margin:0;"><?php echo intval($published); ?></p>
                </div>
                <div style="background:#fff;padding:20px;border:1px solid #ccc;flex:1;text-align:center;">
                    <h3><?php echo esc_html__('Drafts', '{name}'); ?></h3>
                    <p style="font-size:2em;margin:0;"><?php echo intval($drafts); ?></p>
                </div>
            </div>
        </div>
        <?php
    }

    public function render_settings_page(): void {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions.', '{name}'));
        }

        if (isset($_POST['{name}_save_settings']) && check_admin_referer('{name}_settings_action', '{name}_settings_nonce')) {
            $color = sanitize_hex_color($_POST['{name}_setting_color'] ?? '');
            $limit = intval($_POST['{name}_setting_limit'] ?? 10);

            if ($color) {
                update_option('{name}_setting_color', $color);
            }
            update_option('{name}_setting_limit', max(1, min(100, $limit)));

            echo '<div class="notice notice-success"><p>' . esc_html__('Settings saved.', '{name}') . '</p></div>';
        }

        $color = get_option('{name}_setting_color', '#0073aa');
        $limit = get_option('{name}_setting_limit', 10);
        ?>
        <div class="wrap">
            <h1><?php echo esc_html__('{name} Settings', '{name}'); ?></h1>
            <form method="post">
                <?php wp_nonce_field('{name}_settings_action', '{name}_settings_nonce'); ?>
                <table class="form-table">
                    <tr>
                        <th><label for="color"><?php echo esc_html__('Accent Color', '{name}'); ?></label></th>
                        <td><input type="text" id="color" name="{name}_setting_color"
                                   value="<?php echo esc_attr($color); ?>" class="color-picker" /></td>
                    </tr>
                    <tr>
                        <th><label for="limit"><?php echo esc_html__('Items per Page', '{name}'); ?></label></th>
                        <td><input type="number" id="limit" name="{name}_setting_limit"
                                   value="<?php echo intval($limit); ?>" min="1" max="100" /></td>
                    </tr>
                </table>
                <p><input type="submit" name="{name}_save_settings"
                          class="button button-primary"
                          value="<?php echo esc_attr__('Save Settings', '{name}'); ?>" /></p>
            </form>
        </div>
        <?php
    }

    public function render_shortcode(array $atts = []): string {
        $atts = shortcode_atts([
            'limit' => get_option('{name}_setting_limit', 10),
            'color' => get_option('{name}_setting_color', '#0073aa'),
        ], $atts, '{name}');

        $query = new WP_Query([
            'post_type'      => '{name}_item',
            'posts_per_page' => intval($atts['limit']),
            'post_status'    => 'publish',
        ]);

        if (!$query->have_posts()) {
            return '<p>' . esc_html__('No items found.', '{name}') . '</p>';
        }

        $color = esc_attr($atts['color']);
        $output = '<div class="{name}-items" style="--accent:' . $color . ';">';

        while ($query->have_posts()) {
            $query->the_post();
            $output .= sprintf(
                '<article style="border-left:4px solid %s;padding:10px 15px;margin-bottom:10px;background:#f9f9f9;">',
                $color
            );
            $output .= '<h3><a href="' . get_permalink() . '">' . esc_html(get_the_title()) . '</a></h3>';
            $output .= '<p>' . esc_html(wp_trim_words(get_the_excerpt() ?: get_the_content(), 30)) . '</p>';
            $output .= '</article>';
        }

        $output .= '</div>';
        wp_reset_postdata();

        return $output;
    }

    public function filter_content(string $content): string {
        if (!is_singular('{name}_item')) {
            return $content;
        }

        $color = get_option('{name}_setting_color', '#0073aa');
        $badge = sprintf(
            '<span style="display:inline-block;background:%s;color:#fff;padding:2px 10px;border-radius:3px;font-size:0.8em;">%s</span>',
            esc_attr($color),
            esc_html__('{name} Item', '{name}')
        );

        return $badge . '<br><br>' . $content;
    }

    public function register_widget(): void {
        register_widget('{name}_Widget');
    }

    public function enqueue_admin_assets(string $hook): void {
        if (str_contains($hook, '{name}')) {
            wp_enqueue_style('wp-color-picker');
            wp_enqueue_script('wp-color-picker');
            wp_add_inline_script('wp-color-picker', 'jQuery(function($){$(".color-picker").wpColorPicker();});');
        }
    }
}

class {name}_Widget extends WP_Widget {

    public function __construct() {
        parent::__construct(
            '{name}_widget',
            __('{name} Items', '{name}'),
            ['description' => __('Display {name} items in a sidebar.', '{name}')]
        );
    }

    public function widget(array $args, array $instance): void {
        echo $args['before_widget'];
        $title = apply_filters('widget_title', $instance['title'] ?? '');
        if (!empty($title)) {
            echo $args['before_title'] . esc_html($title) . $args['after_title'];
        }

        $limit = intval($instance['limit'] ?? 5);
        $query = new WP_Query([
            'post_type'      => '{name}_item',
            'posts_per_page' => $limit,
            'post_status'    => 'publish',
        ]);

        if ($query->have_posts()) {
            echo '<ul>';
            while ($query->have_posts()) {
                $query->the_post();
                echo '<li><a href="' . get_permalink() . '">' . esc_html(get_the_title()) . '</a></li>';
            }
            echo '</ul>';
            wp_reset_postdata();
        } else {
            echo '<p>' . esc_html__('No items yet.', '{name}') . '</p>';
        }

        echo $args['after_widget'];
    }

    public function form(array $instance): void {
        $title = $instance['title'] ?? '';
        $limit = $instance['limit'] ?? 5;
        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">
                <?php esc_html_e('Title:', '{name}'); ?>
            </label>
            <input class="widefat"
                   id="<?php echo $this->get_field_id('title'); ?>"
                   name="<?php echo $this->get_field_name('title'); ?>"
                   type="text" value="<?php echo esc_attr($title); ?>" />
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('limit'); ?>">
                <?php esc_html_e('Number of items:', '{name}'); ?>
            </label>
            <input class="tiny-text"
                   id="<?php echo $this->get_field_id('limit'); ?>"
                   name="<?php echo $this->get_field_name('limit'); ?>"
                   type="number" step="1" min="1" max="20"
                   value="<?php echo intval($limit); ?>" />
        </p>
        <?php
    }

    public function update(array $new_instance, array $old_instance): array {
        return [
            'title' => sanitize_text_field($new_instance['title'] ?? ''),
            'limit' => intval($new_instance['limit'] ?? 5),
        ];
    }
}

function {name}_plugin(): ?{name}_Plugin {
    return {name}_Plugin::init();
}

{name}_Plugin::init();
