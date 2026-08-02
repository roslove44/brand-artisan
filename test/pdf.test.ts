import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRatios } from "../src/pdf";

// Les deux facons de livrer un carrousel faux sans qu'aucune erreur ne sorte :
// des pages dans le desordre, ou une page au mauvais ratio. Le tri naturel est
// verifie dans utils.test.ts, le ratio ici.

const slide = (name: string, width: number, height: number) => ({ name, width, height });

test("checkRatios : un ratio commun passe, quelle que soit la taille", () => {
	assert.doesNotThrow(() =>
		checkRatios([slide("card-1", 1080, 1350), slide("card-2", 1080, 1350), slide("card-3", 2160, 2700)]),
	);
	assert.doesNotThrow(() => checkRatios([slide("card-1", 1080, 1080)]));
});

test("checkRatios : une page au ratio different arrete l'assemblage", () => {
	assert.throws(
		() => checkRatios([slide("card-1", 1080, 1350), slide("card-2", 1080, 1080)]),
		/card-2 est en 1080x1080, card-1 en 1080x1350/,
	);
});
