@echo off
cd /d "%~dp0"

if not defined JMETER_HOME (
    echo JMETER_HOME is not set. Set it to your Apache JMeter directory.
    pause
    exit /b 1
)

"%JMETER_HOME%\bin\jmeter.bat" -t "%~dp0PerformanceEssentials.jmx"

pause
