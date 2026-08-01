# Use Obsidian's undocumented command API

The command Source uses `app.commands` because Obsidian exposes no public API for enumerating and executing all commands, and established switcher plugins rely on the same boundary. Keep this access isolated, disable the Source with a clear notice when unavailable, and replace it if Obsidian publishes a supported API.
