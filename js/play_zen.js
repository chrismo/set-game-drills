import {GameBase} from './game_base.js'
import {Fast30} from "./fast_30.js";

let gameBase = new GameBase(document);
let fast30 = new Fast30(gameBase);
fast30.totalGuesses = Number.MAX_SAFE_INTEGER;
fast30.enableTimer = false;
fast30.startGame();

