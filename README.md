# Homework Exercise 04 Web-APIs: Code Quiz

[Homework Exercise 04 Web-APIs: Code Quiz](https://timansy.github.io/04_homework/docs/04/)

## Overview

My objective for this homework assignment was to write a quiz application. The look and feel of the site would need to be intuitive, fresh, and engaging. The goal was for the user to intuitively navigate the site and have fun.

![day planner demo](.\docs\04\Assets\2020-04-08 21_50_07-Window2.png)

I sketched the initial layout on some paper. What I ended up with is pretty cloase to what was initially laid out. I wanted to really bring an instantly playable game to the table.

When a user visits, they are welcomed to a the Quiz Show. The pastels and laid back fonts remind me of a 70's quiz show. Once I had a feeling for the site the pieces just fell into place.

To add question depth, I decided to tie into [Open Trivia Database API](https://opentdb.com/) to generate questions. As far as a first time working with APIs, it could not have gone better. Once I had everything worked through, the added (nearly infinite) mix of questions was worth the extra effort.

Please give it a try (or a few) and let me know what you think.

## Methods

I like working out the layout first. It gives me the space needed to plan how best to implement the functionality. On the original sketch, you might notice that the Traffic Signal area, which shows the time and question counts, does not look much like a traffic symbol. As I was building the other pieces, I realized it could have the same look and feel.

When we started this execise, I had never used jquery. I started to build it very programatically, with functions everywhere, for every element _UpdateTrafficSignal()_ or somthing similar. What I ended up with is a mess. A working mess. But a mess. Needless to say that if I would code this again, I would use whatever is best practice at the time.

## Highlights

Learning about APIs. I felt as if a whole new world opened up. Though I spent an inordinant amount of time getting the JSON object to store in my array object, I learned a ton (even now I know way better methods now).

I showed this one off to the family.

### To Do

* Store Highscores
    * Set maximum entries and limit based upon current score
* Set to work on phone
* Clean up code! !!!
    * add more filters for the textCleaner function
    * click > view answer timing is off

