import {GameBase} from './game_base.js'
import {SixInTwelve} from "./6_in_12.js";

let gameBase = new GameBase(document);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let boardSeed = urlParams.get('board');
if (boardSeed === null) boardSeed = undefined;
let six = new SixInTwelve(gameBase, boardSeed);
six.startGame();
