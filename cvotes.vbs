Set psuiShell = CreateObject("Wscript.Shell")

psuiShell.CurrentDirectory = "D:\LAB15\git\CountingVotes\ps-ui\"

psuiShell.Run "node server.js", 0


Set psbeShell = CreateObject("Wscript.Shell")

psuiShell.CurrentDirectory = "D:\LAB15\git\CountingVotes\ps-backend\"

psuiShell.Run "node app\server.js", 0