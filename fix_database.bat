@echo off
SETLOCAL EnableDelayedExpansion

:: Configuration
set "BIN_PATH=C:\Program Files\PostgreSQL\18\bin"
set "DATA_PATH=C:\Program Files\PostgreSQL\18\data"
set "SERVICE_NAME=postgresql-x64-18"
set "NEW_PASS=admin123"

:: Force IPv4 to ensure trust mapping matches
set "PGHOST=127.0.0.1"

echo ============================================================
echo   SmartGrade AI - PostgreSQL Auto-Repair Tool (v2)
echo ============================================================
echo.
echo This script will:
echo 1. Restart PostgreSQL in Temporary Trust Mode
echo 2. Reset the 'postgres' user password to: %NEW_PASS%
echo 3. Create the 'smartgrade' database if it doesn't exist
echo 4. Restore original security settings
echo.
echo Please ensure you are running this as ADMINISTRATOR.
echo.

:: 1. Restart Service
echo [Step 1/4] Restarting PostgreSQL service...
net stop !SERVICE_NAME!
net start !SERVICE_NAME!
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to restart service. Did you run as Administrator?
    pause
    exit /b
)

:: 2. Reset Password
echo [Step 2/4] Resetting password to '!NEW_PASS!'...
:: We use 127.0.0.1 explicitly to match the trust entry
"!BIN_PATH!\psql.exe" -h 127.0.0.1 -U postgres -c "ALTER USER postgres WITH PASSWORD '!NEW_PASS!';"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to reset password. It is still asking for a password.
    echo Please ensure the file 'C:\Program Files\PostgreSQL\18\data\pg_hba.conf' 
    echo has 'trust' set for 127.0.0.1 and ::1.
    pause
    exit /b
)

echo [Step 2.5/4] Ensuring 'smartgrade' database exists...
"!BIN_PATH!\psql.exe" -h 127.0.0.1 -U postgres -c "SELECT 'CREATE DATABASE smartgrade' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'smartgrade')\gexec"

:: 3. Revert pg_hba.conf (Both IPv4 and IPv6)
echo [Step 3/4] Restoring original security settings...
powershell -Command "$content = gc '!DATA_PATH!\pg_hba.conf'; $content = $content -replace '127.0.0.1/32            trust', '127.0.0.1/32            scram-sha-256'; $content = $content -replace '::1/128                 trust', '::1/128                 scram-sha-256'; $content | Out-File -encoding ASCII '!DATA_PATH!\pg_hba.conf'"

:: 4. Final Restart
echo [Step 4/4] Finalizing service restart...
net stop !SERVICE_NAME!
net start !SERVICE_NAME!

echo.
echo ============================================================
echo Success! Your PostgreSQL is now ready.
echo Password: !NEW_PASS!
echo ============================================================
echo.
pause
