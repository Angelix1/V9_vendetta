import { logger } from "@vendetta";
import { registerCommand } from "@vendetta/commands";
import { showConfirmationAlert } from "@vendetta/ui/alerts";
// import Uwuifier from './uwu.ts';
enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT
}
enum ApplicationCommandInputType {
    BUILT_IN,
    BUILT_IN_TEXT,
    BUILT_IN_INTEGRATION,
    BOT,
    PLACEHOLDER
}
enum ApplicationCommandType {
    CHAT = 1,
    USER,
    MESSAGE
}

function Convert(
  sentence, 
  facials = 0.05, 
  acts = 0.075, 
  stuts = 0.5, 
  wording=1, 
  ex=1
): void {
	// const DEFAULTS = {
	// 	spaces: { faces: 5, actions: , stutters: 0.1 },
	// 	words: 1,
	// 	exclamations: 1,
	// };

    const _spacesModifier = { 
    	faces: facials,
    	actions: acts,
    	stutters: stuts,
    };
    const _wordsModifier = wording;
    const _exclamationsModifier = ex;

    const faceThreshold = _spacesModifier.faces;
    const actionThreshold = _spacesModifier.actions + faceThreshold;
    const stutterThreshold = _spacesModifier.stutters + actionThreshold;

    const words = sentence.split(" ");
    const faces = [
        "(・`ω´・)",
        ";;w;;",
        "OwO",
        "UwU",
        ">w<",
        "^w^",
        "ÚwÚ",
        "^-^",
        ":3",
        "x3",
    ];
    const exclamations = [
        "!?", "?!!", "?!?1", "!!11", "?!?!"
    ];
    const actions = [
        "*blushes*",
        "*whispers to self*",
        "*cries*",
        "*screams*",
        "*sweats*",
        "*twerks*",
        "*runs away*",
        "*screeches*",
        "*walks away*",
        "*sees bulge*",
        "*looks at you*",
        "*notices buldge*",
        "*starts twerking*",
        "*huggles tightly*",
        "*boops your nose*",
    ];
    const uwuMap = [
        [/(?:r|l)/g, "w"],
        [/(?:R|L)/g, "W"],
        [/n([aeiou])/g, "ny$1"],
        [/N([aeiou])/g, "Ny$1"],
        [/N([AEIOU])/g, "Ny$1"],
        [/ove/g, "uv"],
    ];
	
	// SEED	
	function generateRawSeed(str) {
        let h = 1779033703 ^ str.length;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
            h = h << 13 | h >>> 19;
        }
        return () => {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }
	}

	function random(min = 0, max = 1, rawSeed) {
        if (min > max) throw new Error("> random");
        if (min === max) throw new Error("== random");
        return denormalize(sfc32(rawSeed), min, max);
    }

    function randomInt(min = 0, max = 1, seed) {
        return Math.round(random(min, max, seed));
    }

	function denormalize(value, min, max) {
        return value * (max - min) + min;
    }

    function sfc32(rawSeed) {
        let a = rawSeed();
        let b = rawSeed();
        let c = rawSeed();
        let d = rawSeed();
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        let t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    }


    // Functions
	const isAt = (word) => { return word.charAt(0) === "@" };
	function isLetter(char) {
		return /^\p{L}/u.test(char);
	}
	
	function isUri(value) {
		if (!value) return false;
		if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) return false;
		if (/%[^0-9a-f]/i.test(value) || /%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return false;
		const split = value.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);

		if (!split) return false;
		const [, scheme, authority, path] = split;

		if (!(scheme && scheme.length && path.length >= 0)) return false;
		if (authority && authority.length) {
			if (!(path.length === 0 || /^\//.test(path))) return false;
		} 
		else if (/^\/\//.test(path)) return false;

		if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase())) return false;
		return true;
	}
	
	function isUpperCase(char) {
		return char === char.toUpperCase();
	}

	function getCapitalPercentage(str) {
		let totalLetters = 0;
		let upperLetters = 0;

		for (const currentLetter of str) {
		if (!isLetter(currentLetter)) continue;

		if (isUpperCase(currentLetter)) {
		  upperLetters++;
		}

		totalLetters++;
		}

		return upperLetters / totalLetters;
	}


	// Start uwu
    let uwuifiedSentence = words.map((word) => {
        if (isAt(word)) return word;
        if (isUri(word)) return word;
        const seed = generateRawSeed(word);
		// console.log(seed)

        for (const [oldWord, newWord] of uwuMap) {
            if (random(undefined, undefined, seed) > _wordsModifier) continue;
            word = word.replace(oldWord, newWord);
        }
        return word;
    }).join(" ");

    // start space uwu
    uwuifiedSentence = uwuifiedSentence.split(" ");
        
    uwuifiedSentence = uwuifiedSentence.map((word, index) => {
        const seed = generateRawSeed(word);
        const randomized = random(undefined, undefined, seed);
        const [firstCharacter] = word;

        if (randomized <= faceThreshold && faces) {
            word += " " + faces[randomInt(0, faces.length - 1, seed)];
            checkCapital();
        } 
        else if (randomized <= actionThreshold && actions) {
            // Add random action before the word
            word += " " + actions[randomInt(0, actions.length - 1, seed)];
            checkCapital();
        } 
        else if (randomized <= stutterThreshold && !isUri(word)) {
            // Add stutter with a length between 0 and 2
            const stutter = randomInt(0, 2, seed);
            return (firstCharacter + "-").repeat(stutter) + word;
        }

        function checkCapital() {
            if (firstCharacter !== firstCharacter.toUpperCase()) return;
            if (getCapitalPercentage(word) > 0.5) return;            
            if (index === 0) {
                word = firstCharacter.toLowerCase() + word.slice(1);
            } 
            else {
                const previousWord = words[index - 1];
                const previousWordLastChar = previousWord[previousWord.length - 1];
                const prevWordEndsWithPunctuation = new RegExp("[.!?\\-]").test(previousWordLastChar);
                if (!prevWordEndsWithPunctuation) return;
                word = firstCharacter.toLowerCase() + word.slice(1);
            }
        }
        return word;
    }).join(" ");

    uwuifiedSentence = uwuifiedSentence.split(" ");

    const pattern = new RegExp("[?!]+$");
    
    uwuifiedSentence = uwuifiedSentence.map((word) => {
        const seed = generateRawSeed(word);
        // If there are no exclamations return
        if (!pattern.test(word) || random(undefined, undefined, seed) > _exclamationsModifier) return word;
        
        word = word.replace(pattern, "");
        word += exclamations[randomInt(0, this.exclamations.length - 1, seed)];
        return word;
    }).join(" ");


    return uwuifiedSentence;
}



async function SEND(content): void {
  return await new Promise((resolve): void => {
    resolve({ 
      content: content
    })
  });
}

let CMD = [];

export const onLoad = () => {
  CMD = registerCommand({
      name: "uwuify",
      displayName: "uwuify",
      description: "spek uwu",
      displayDescription: "spek uwu",
      type: 1,
      applicationId: "-1",
      inputType: 1,
      options: [
          {
            name: "textme",
            displayName: "owo",
            description: "owo",
            displayDescription: "owo",
            required: true,
            type: 3
          },
      ],
      async execute(args, context) {
        // Convert(sentence, facials, acts, stuts, wording, ex)
        let WORDE = args.find((o: any) => o.name === "textme").value;

        let o = () => { return Math.random().toFixed(3) }
        
        console.log('[ UwUifer]', WORDE, Convert(WORDE, o(),o(),o(),o(),o()))
        return await SEND(
          Convert(WORDE, o(),o(),o(),o(),o() )
        )
      },
    })
  // )  
}
export const onUnload = () => {
    // for (const C of CMD) {
    //   C()
    // }
  CMD?.()
}
