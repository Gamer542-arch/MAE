namespace {name};

public partial class Form1 : Form
{
    private readonly ListBox listBox;
    private readonly TextBox inputBox;
    private readonly Button addButton;
    private readonly Button deleteButton;
    private readonly StatusStrip statusStrip;
    private readonly ToolStripStatusLabel statusLabel;
    private readonly TextBox detailBox;

    private readonly List<TodoItem> items = new();

    public Form1()
    {
        Text = "{name}";
        Size = new Size(600, 450);
        StartPosition = FormStartPosition.CenterScreen;

        var mainPanel = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 3,
            Padding = new Padding(10),
            ColumnStyles =
            {
                new ColumnStyle(SizeType.Percent, 50),
                new ColumnStyle(SizeType.Percent, 50)
            }
        };

        var leftPanel = new Panel { Dock = DockStyle.Fill };
        var rightPanel = new Panel { Dock = DockStyle.Fill };

        listBox = new ListBox
        {
            Dock = DockStyle.Fill,
            Font = new Font("Segoe UI", 11)
        };
        listBox.SelectedIndexChanged += OnSelectionChanged;

        detailBox = new TextBox
        {
            Dock = DockStyle.Fill,
            Multiline = true,
            ReadOnly = true,
            Font = new Font("Segoe UI", 11),
            BackColor = Color.White
        };

        var bottomPanel = new FlowLayoutPanel
        {
            Dock = DockStyle.Bottom,
            Height = 40,
            FlowDirection = FlowDirection.LeftToRight,
            Padding = new Padding(0, 5, 0, 0)
        };

        inputBox = new TextBox
        {
            Width = 300,
            Font = new Font("Segoe UI", 11),
            PlaceholderText = "Enter a new task..."
        };
        inputBox.KeyPress += (s, e) =>
        {
            if (e.KeyChar == (char)Keys.Enter) AddItem();
        };

        addButton = new Button
        {
            Text = "Add",
            Width = 80,
            Font = new Font("Segoe UI", 10, FontStyle.Bold),
            BackColor = Color.DodgerBlue,
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat
        };
        addButton.Click += (s, e) => AddItem();

        deleteButton = new Button
        {
            Text = "Delete",
            Width = 80,
            Font = new Font("Segoe UI", 10),
            Enabled = false
        };
        deleteButton.Click += (s, e) => DeleteItem();

        bottomPanel.Controls.AddRange(new Control[] { inputBox, addButton, deleteButton });

        statusStrip = new StatusStrip();
        statusLabel = new ToolStripStatusLabel("Ready");
        statusStrip.Items.Add(statusLabel);

        leftPanel.Controls.Add(listBox);
        leftPanel.Controls.Add(bottomPanel);
        rightPanel.Controls.Add(detailBox);

        mainPanel.Controls.Add(leftPanel, 0, 0);
        mainPanel.Controls.Add(rightPanel, 1, 0);
        mainPanel.SetRowSpan(leftPanel, 2);
        mainPanel.SetRowSpan(rightPanel, 2);
        mainPanel.Controls.Add(statusStrip, 0, 2);
        mainPanel.SetColumnSpan(statusStrip, 2);

        Controls.Add(mainPanel);
    }

    private void AddItem()
    {
        var text = inputBox.Text.Trim();
        if (string.IsNullOrEmpty(text))
        {
            statusLabel.Text = "Please enter some text";
            return;
        }

        var item = new TodoItem
        {
            Id = items.Count + 1,
            Text = text,
            CreatedAt = DateTime.Now
        };

        items.Add(item);
        listBox.Items.Add(item);
        inputBox.Clear();
        inputBox.Focus();

        statusLabel.Text = $"Added item #{item.Id}";
    }

    private void DeleteItem()
    {
        if (listBox.SelectedItem is not TodoItem item) return;

        items.Remove(item);
        listBox.Items.Remove(item);
        detailBox.Clear();
        deleteButton.Enabled = false;

        statusLabel.Text = $"Deleted item #{item.Id}";
    }

    private void OnSelectionChanged(object? sender, EventArgs e)
    {
        if (listBox.SelectedItem is TodoItem item)
        {
            detailBox.Text = $"ID: {item.Id}\r\n" +
                             $"Text: {item.Text}\r\n" +
                             $"Created: {item.CreatedAt:yyyy-MM-dd HH:mm:ss}\r\n" +
                             $"Status: {(item.Completed ? "Completed" : "Pending")}";
            deleteButton.Enabled = true;
        }
        else
        {
            detailBox.Clear();
            deleteButton.Enabled = false;
        }
    }
}

public class TodoItem
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool Completed { get; set; }

    public override string ToString() => $"[{Id}] {Text}";
}
