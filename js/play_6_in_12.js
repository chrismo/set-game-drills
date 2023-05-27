import {GameBase} from './game_base.js'
import {SixInTwelve} from "./6_in_12.js";

let gameBase = new GameBase(document);
let six = new SixInTwelve(gameBase);
six.startGame();
