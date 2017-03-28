# JavaScript 2
### Nackademin / FEND16: Yoko Andrae

## AJAX API

Live Site:  https://yaorangetime16.github.io/ajax/

### About the web application
This is a card game application which includes three simple card games. It is made with the help of the "deck of card" API returning response of json-file.
This application calls the API using jQuery's `$.ajax()` method, and the API requires different URLs to be accessed for its json data, depending on e.g. how many cards the player wants to draw.

In addition, there is another API (not ReST API) used in this application, which helps some functionalities of the game.

### APIs in this application
* Deck of Cards (AJAX / Main)  
https://deckofcardsapi.com/

* Pokersolver (installed by npm / Extra)  
https://github.com/goldfire/pokersolver  
This is a supplimental API for this application.
It helps to get results of "Five Card Draw" where its coding is far complicated.

### Tools and Tecknologies
|Working Area | Tool|
|-----|-----|
|Mockup, images|Photoshop|
|SVG|Illustrator|
|Coding|Brackets|
|CSS|Sass, Bootstrap|
|Javascript|jQuery|
|extra API|npm browserify|
|Version Control|GitHub|
|Planning|Paper & Pen|

### References

#### API
* [Public APIs by toddmotto @ GitHub](https://github.com/toddmotto/public-apis)

#### Fonts
* Google Fonts

#### Images
* pixabay
* [loadinfo](http://www.loadinfo.net/)
* [Frame Design](http://frames-design.com/) (Japanese)

#### JS Codes
* sorting array
[Web Drawer: a programmer's blog](http://webdrawer.net/javascript/jssort.html) (Japanese)
* limit clicks
[a Programmer's blog](https://halkyo.wordpress.com/2016/03/25/jquery-%E6%8C%87%E5%AE%9A%E3%81%AE%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E5%9B%9E%E6%95%B0%E3%81%A7class%E3%82%92%E4%BB%98%E5%8A%A0/) (Japanese)
* To change "prevObject" to an array `$.makeArray()`
[Qiita: website for programmers](http://qiita.com/kazu56/items/0d49adc864bed0ed4fa2) (Japanese)

### Wroking Process on this assignment
I came up with some ideas about what my application should be doing, but it took time to find a right API, which wouldn't cause a Cross-browser problem. As I wanted to make something "fun" (skoj, kul, roligt!) anyway, so I decided to this gaming application. Then, I started listing up which functionalities I need to buid up, what should be shown on the website.  My first plan was just one simple game, but then, I added later two more games.  Coding itself was really interesting for me. I learned jQuery a lot through this assigment, and yes, it was a lot easier and less coding to create a dynamic website.  

  As I used a secondary API which required "browserify" to work on browsers, I tried to use "gulp" (there was "gulp-browserify" that could supposingly "watch" the file's updating). However, I haven't really understood as much as I could manipulate well, so I just gave up using it. If I could have more time, then I would have learned more about "gulp".