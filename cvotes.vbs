Set psuiShell = CreateObject("Wscript.Shell")

psuiShell.CurrentDirectory = "C:\Users\demo\cvotes\ps-ui\"

psuiShell.Run "node server.js", 0


Set psbeShell = CreateObject("Wscript.Shell")

psbeShell.CurrentDirectory = "C:\Users\demo\cvotes\ps-backend\"

psbeShell.Run "node app\server.js", 0