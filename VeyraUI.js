const windowUI = VeyraUI.CreateWindow({
  name: "My Hub"
});

// Create tabs directly in code
const home = windowUI.CreateTab({
  name: "Home",
  icon: "⌂"
});

const settings = windowUI.CreateTab({
  name: "Settings",
  icon: "⚙"
});

// Add a button
home.CreateButton({
  name: "Welcome",
  description: "Shows a notification.",
  buttonText: "Click me",
  callback: () => windowUI.Notify({
    title: "Hello!",
    content: "VeyraUI is working."
  })
});

// Add a toggle
settings.CreateToggle({
  name: "Example Toggle",
  description: "An example on/off setting.",
  defaultValue: false,
  callback: value => console.log("Toggle:", value)
});

// Create another tab whenever needed
const extra = windowUI.CreateTab({
  name: "Extra",
  icon: "✦"
});

// Select a tab
extra.Select();

// Rename a tab
extra.SetName("More Tools");

// Remove a tab
// extra.Destroy();

// Close the entire UI
// windowUI.Destroy();
