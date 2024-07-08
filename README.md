A simple web-based tower defense game I developed as a programming challenge for myself.

I had been teaching myself web-based development using HTML/CSS/JS and PHP and wanted to develop
a capstone project in the form of a web based video game and to test the feasibility of developing 
videogames using JavaScript.

The game allows you to place down towers with unique abilities, earn money,
and upgrade your units to fight oncoming waves of enemies.

This project will the basis for a server based game architecture using NodeJS and PHP where 
I will be able to host multiple different games. I have other projects hosted on my Github 
which serve a similar function such as ChatApp (a multi channel chat room using NodeJS).

Video Preview: https://youtu.be/QeCCNtOZYKY

=== Instructions ===

Enemies will follow the track from the left side of the screen to the right side and you must prevent
them from reaching the end to avoid losing the game.

To stop them, you must purchase towers from the right sidebar and place them within the canvas.

Units can be upgraded my selecting the "$" icon which appears on the bar above the tower.
In addition to the "$" icon, you can also change their enemy targeting priority with the button on the left of the bar,
and view the unit's stats with the middle icons. In order, they represent: damage, how often they attack, and their range.

You can start the game once youve placed your starting towers by selecting the green play icon at the bottom right of the screen.

=== Debug mode ===

The game starts in debug mode which shows enemy location as well as a visual indicator of where your towers will attack.

This can be disabled by typing "debug=false" in the console found by pressend F12.

