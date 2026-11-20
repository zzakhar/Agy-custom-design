# Agy Custom Design Chat Control Rules

When the user asks to install, customize, or restore their Antigravity interface:

1. **Native Installation & Rollback**:
   - If user asks to install / patch the custom interface ("Установи кастомный интерфейс", "Накати патч"):
     Execute directly: `python "C:\Users\User\Desktop\Agy-Custom-Design\installer.py" install --restart`
   - If user asks to revert / restore to clean original Antigravity:
     Execute directly: `python "C:\Users\User\Desktop\Agy-Custom-Design\installer.py" restore --restart`

2. **Direct Styling & Chat Customization**:
   - Do NOT tell the user to manually click buttons or edit config files.
   - Execute the action directly via `agy_control.py`:
     - Set wallpaper: `python "C:\Users\User\Desktop\Agy-Custom-Design\agy_control.py" set-wallpaper "<path_or_url>" [--dim <0-1>] [--blur <px>] [--alpha <0-1>]`
     - Set theme preset: `python "C:\Users\User\Desktop\Agy-Custom-Design\agy_control.py" set-theme --preset swiss|neon|linear|oled`
     - Rename model: `python "C:\Users\User\Desktop\Agy-Custom-Design\agy_control.py" rename-model "<original>" "<new_name>"`
     - Rename account: `python "C:\Users\User\Desktop\Agy-Custom-Design\agy_control.py" rename-account "<new_name>"`
     - Mascot speech / status: `python "C:\Users\User\Desktop\Agy-Custom-Design\agy_control.py" mascot --say "<phrase>"`

3. **Hot-Reload**:
   - The UI automatically hot-reloads within 1 second of config change. No restart is needed for styling, wallpapers, and renames.
