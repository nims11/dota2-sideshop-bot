Dota2 sideshop bot (using node-dota2)
========

A horribly written bot to spend your sideshop gold. My javascript skills are as
good as my dancing skills, which is evident from the code. So no guarantees. I
have tried to make code conservative by throwing an error whenever it finds
something weird (including the emblem, which couldn't be tested due to obvious
reasons).

I have provided all the sideshop api so you can very easily implement your own
algorithm.


## Installation and setup node-dota2
* `npm install` in your repository root
* Copy `node_modules/dota2/examples/config.js.example` to `config.js` in your project root and edit appropriately
* Copy the latest protobufs from `./protobufs` to `node_modules/steam-resources/protobufs/dota2`
* Run the example script: `node sideshop_show.js` (This will just show your
    sideshop status and exit)
* If you get disconnect errors, most likely there is something wrong with your steam guard code in config.js
* To run the real thing: `node sideshop_bot.js`
* Make sure to use at least version 4.4.5 of node js

### Algorithm

Since I had thousands of sideshop gold, I only wanted to deal with tier 5
heroes. I couldn't come up with an optimal algorithm so I went with a greedy
approach. I implemented this as a simple state machine where

1. Sell all 3 star heroes in the bench.
2. Buy everything from the shop if the purchase leads to freeing a bench slot
   (making 2/3 star heroes). If a purchase was made, go to 1.
3. Buy a high worth hero from the shop to replace a low worth hero occupying a
   bench (or if the bench is empty). For a particular hero, worth is computed by
   adding all instances of that hero in the bench (2 star is computed thrice).
   If a purchase was made, go to 1.
4. Reroll the sideshop.


### Tier distribution

Out of curiosity, I logged 741 rerolls to compute the distribution of tiers.
Here are the chances that you will get a tier 5 hero in a roll.


| Tier | % |
| ---- | - |
| 1    | 71.12 |
| 2    | 18.03 |
| 3    | 6.23 |
| 4    | 3.37 |
| 5    | 1.24 |
