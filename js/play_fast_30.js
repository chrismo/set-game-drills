// this is crap code organization

import {GameBase} from './game_base.js'
import {Fast30} from "./fast_30.js";

let gameBase = new GameBase(document);
let fast30 = new Fast30(gameBase);
fast30.startGame();
