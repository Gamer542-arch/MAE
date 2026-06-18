import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.List;
import java.util.logging.Logger;

public class App extends JFrame {

    private static final Logger LOG = Logger.getLogger(App.class.getName());
    private final JTextArea textArea;
    private final JLabel statusLabel;
    private File currentFile;

    public App() {
        setTitle("my-java-project Text Editor");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(800, 600);
        setLocationRelativeTo(null);

        textArea = new JTextArea();
        textArea.setFont(new Font("Monospaced", Font.PLAIN, 14));
        textArea.setTabSize(4);
        JScrollPane scrollPane = new JScrollPane(textArea);
        scrollPane.setBorder(new EmptyBorder(8, 8, 8, 8));

        statusLabel = new JLabel(" ");
        statusLabel.setBorder(new EmptyBorder(4, 8, 4, 8));

        setJMenuBar(createMenuBar());
        add(scrollPane, BorderLayout.CENTER);
        add(statusLabel, BorderLayout.SOUTH);

        setStatus("Ready");
    }

    private JMenuBar createMenuBar() {
        JMenuBar menuBar = new JMenuBar();

        JMenu fileMenu = new JMenu("File");
        fileMenu.add(new JMenuItem(new FileAction("New", KeyStroke.getKeyStroke("ctrl N"), this::newFile)));
        fileMenu.add(new JMenuItem(new FileAction("Open...", KeyStroke.getKeyStroke("ctrl O"), this::openFile)));
        fileMenu.add(new JMenuItem(new FileAction("Save", KeyStroke.getKeyStroke("ctrl S"), this::saveFile)));
        fileMenu.add(new JMenuItem(new FileAction("Save As...", KeyStroke.getKeyStroke("ctrl shift S"), this::saveAsFile)));
        fileMenu.addSeparator();
        fileMenu.add(new JMenuItem(new FileAction("Exit", null, e -> System.exit(0))));

        JMenu editMenu = new JMenu("Edit");
        editMenu.add(new JMenuItem(new FileAction("Cut", KeyStroke.getKeyStroke("ctrl X"), e -> textArea.cut())));
        editMenu.add(new JMenuItem(new FileAction("Copy", KeyStroke.getKeyStroke("ctrl C"), e -> textArea.copy())));
        editMenu.add(new JMenuItem(new FileAction("Paste", KeyStroke.getKeyStroke("ctrl V"), e -> textArea.paste())));

        JMenu helpMenu = new JMenu("Help");
        helpMenu.add(new JMenuItem(new FileAction("About", null, e -> JOptionPane.showMessageDialog(
                this, "my-java-project Text Editor v1.0\nA simple Swing text editor.",
                "About", JOptionPane.INFORMATION_MESSAGE))));

        menuBar.add(fileMenu);
        menuBar.add(editMenu);
        menuBar.add(helpMenu);
        return menuBar;
    }

    private void newFile() {
        textArea.setText("");
        currentFile = null;
        setTitle("my-java-project Text Editor - Untitled");
        setStatus("New file created");
    }

    private void openFile() {
        JFileChooser chooser = new JFileChooser();
        if (chooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            try {
                currentFile = chooser.getSelectedFile();
                String content = Files.readString(currentFile.toPath(), StandardCharsets.UTF_8);
                textArea.setText(content);
                setTitle("my-java-project Text Editor - " + currentFile.getName());
                setStatus("Opened " + currentFile.getName());
            } catch (IOException ex) {
                LOG.severe("Failed to open file: " + ex.getMessage());
                JOptionPane.showMessageDialog(this, "Error opening file:\n" + ex.getMessage(),
                        "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void saveFile() {
        if (currentFile == null) {
            saveAsFile();
            return;
        }
        try {
            Files.writeString(currentFile.toPath(), textArea.getText(), StandardCharsets.UTF_8);
            setStatus("Saved " + currentFile.getName());
        } catch (IOException ex) {
            LOG.severe("Failed to save file: " + ex.getMessage());
            JOptionPane.showMessageDialog(this, "Error saving file:\n" + ex.getMessage(),
                    "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void saveAsFile() {
        JFileChooser chooser = new JFileChooser();
        if (chooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            currentFile = chooser.getSelectedFile();
            saveFile();
            setTitle("my-java-project Text Editor - " + currentFile.getName());
        }
    }

    private void setStatus(String message) {
        statusLabel.setText(" " + message);
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            LOG.warning("Could not set system look and feel: " + e.getMessage());
        }

        SwingUtilities.invokeLater(() -> {
            App app = new App();
            app.setVisible(true);
        });
    }

    @FunctionalInterface
    interface FileActionCallback {
        void execute(ActionEvent e);
    }

    record FileAction(String name, KeyStroke accelerator, FileActionCallback callback) {
        public JMenuItem toMenuItem() {
            JMenuItem item = new JMenuItem(name);
            if (accelerator != null) item.setAccelerator(accelerator);
            item.addActionListener(callback::execute);
            return item;
        }
    }
}
