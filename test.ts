import { UsfmLexer, UsfmParser } from './src'

const content = `
\\id GEN World English Bible (WEB) 
\\ide UTF-8
\\h Genesis 
\\toc1 The First Book of Moses, Commonly Called Genesis 
\\toc2 Genesis 
\\toc3 Gen 
\\mt2 The First Book of Moses, 
\\mt3 Commonly Called 
\\mt1 Genesis 
\\c 1  
\\p
\\v 1 In the beginning, God\\f + \\fr 1:1  \\ft The Hebrew word rendered “God” is “אֱלֹהִ֑ים” (Elohim).\\f* created the heavens and the earth. 
\\v 2 The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters. 
\\p
\\v 3 God said, “Let there be light,” and there was light. 
\\v 4 God saw the light, and saw that it was good. God divided the light from the darkness. 
\\v 5 God called the light “day”, and the darkness he called “night”. There was evening and there was morning, the first day. 
\\p
\\v 6 God said, “Let there be an expanse in the middle of the waters, and let it divide the waters from the waters.” 
\\v 7 God made the expanse, and divided the waters which were under the expanse from the waters which were above the expanse; and it was so. 
\\v 8 God called the expanse “sky”. There was evening and there was morning, a second day. 
\\p
\\v 9 God said, “Let the waters under the sky be gathered together to one place, and let the dry land appear;” and it was so. 
\\v 10 God called the dry land “earth”, and the gathering together of the waters he called “seas”. God saw that it was good. 
\\v 11 God said, “Let the earth yield grass, herbs yielding seeds, and fruit trees bearing fruit after their kind, with their seeds in it, on the earth;” and it was so. 
\\v 12 The earth yielded grass, herbs yielding seed after their kind, and trees bearing fruit, with their seeds in it, after their kind; and God saw that it was good. 
\\v 13 There was evening and there was morning, a third day. 
\\p
\\v 14 God said, “Let there be lights in the expanse of the sky to divide the day from the night; and let them be for signs to mark seasons, days, and years; 
\\v 15 and let them be for lights in the expanse of the sky to give light on the earth;” and it was so. 
\\v 16 God made the two great lights: the greater light to rule the day, and the lesser light to rule the night. He also made the stars. 
\\v 17 God set them in the expanse of the sky to give light to the earth, 
\\v 18 and to rule over the day and over the night, and to divide the light from the darkness. God saw that it was good. 
\\v 19 There was evening and there was morning, a fourth day. 
\\p
\\v 20 God said, “Let the waters abound with living creatures, and let birds fly above the earth in the open expanse of the sky.” 
\\v 21 God created the large sea creatures and every living creature that moves, with which the waters swarmed, after their kind, and every winged bird after its kind. God saw that it was good. 
\\v 22 God blessed them, saying, “Be fruitful, and multiply, and fill the waters in the seas, and let birds multiply on the earth.” 
\\v 23 There was evening and there was morning, a fifth day. 
\\p
\\v 24 God said, “Let the earth produce living creatures after their kind, livestock, creeping things, and animals of the earth after their kind;” and it was so. 
\\v 25 God made the animals of the earth after their kind, and the livestock after their kind, and everything that creeps on the ground after its kind. God saw that it was good. 
\\p
\\v 26 God said, “Let’s make man in our image, after our likeness. Let them have dominion over the fish of the sea, and over the birds of the sky, and over the livestock, and over all the earth, and over every creeping thing that creeps on the earth.” 
\\v 27 God created man in his own image. In God’s image he created him; male and female he created them. 
\\v 28 God blessed them. God said to them, “Be fruitful, multiply, fill the earth, and subdue it. Have dominion over the fish of the sea, over the birds of the sky, and over every living thing that moves on the earth.” 
\\v 29 God said, “Behold,\\f + \\fr 1:29  \\ft “Behold”, from “הִנֵּה”, means look at, take notice, observe, see, or gaze at. It is often used as an interjection.\\f* I have given you every herb yielding seed, which is on the surface of all the earth, and every tree, which bears fruit yielding seed. It will be your food. 
\\v 30 To every animal of the earth, and to every bird of the sky, and to everything that creeps on the earth, in which there is life, I have given every green herb for food;” and it was so. 
\\p
\\v 31 God saw everything that he had made, and, behold, it was very good. There was evening and there was morning, a sixth day. 
`

class Test {
    static main() {
        const usfmLexer = new UsfmLexer()
        usfmLexer.lexer.source = `\n${content}`
        const usfmParser = new UsfmParser(usfmLexer)
        usfmParser.start = 1
        const result = usfmParser.parse()
        console.log(JSON.stringify(result, null, 2))
    }
}

Test.main()