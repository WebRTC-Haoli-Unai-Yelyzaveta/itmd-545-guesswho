# Project Two: Chat Plus Guess Who Game

## Project Description

This project is to build chat-based application that enables realtime audio, video, and text/data communication over a WebRTC connection. The WebRTC portion will allow multiple separate pairs of users to join their own private “rooms.” The plus part of this chat app will allow separate pairs of users to engage in playing the guess who game.

## About Guess Who Game

Guess Who is a two player guessing game where each player starts the game with a board that includes cartoon image of 24 people and their first name with all the images standing up. Each player selects a card of their choice from cards containing the same 24 images. The object of the game is to be the first to determine which card one's opponent has selected. Players alternate asking various yes or no questions to eliminate candidates, such as "Does your person wear glasses?" The player will then eliminate candidates (based on the opponent's response) by flipping those images down until only one is left. Well-crafted questions allow players to eliminate one or more possible cards. 
See [Guess Who Game](https://en.wikipedia.org/wiki/Guess_Who%3F).

## Development Stack
* Server: Express.js, Socket.io
* Client: JavaScript, HTML, CSS
* API: WebRTC, Web Workers, Web Sockets, and Web Notifications

