var http = require('http');
var https = require("https");
var natural = require('natural');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
var path = require("path");
var fs = require("fs");
var Tokenizer = require('sentence-tokenizer');
var nlp = require('compromise');
var wordnet = new natural.WordNet();
var textract = require('textract');
const { URL } = require('url');

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

natural.PorterStemmer.attach();

const labelPerson = "NNP.PERS"
const labelLocation = "NNP.LOC"
const labelDate = "DATE"
const labelValue = "VAL"
const labelValueObject = "VAL.OBJ"
const labelOrganization = "NNP.ORG"

const port = process.env.PORT || 8080;

function sentenceArray(text) {
    //We split the input text into an array of sentences (sentence tokenization)
    var sentenceTok = new Tokenizer('Chuck');
    sentenceTok.setEntry(text);
    var arraySentences = sentenceTok.getSentences();
    var questions = taggify(arraySentences);
    return questions;
}

function preProcessing(sentence) {
    for (var i = 0; i < sentence.length; i++) {
        if (sentence[i] == '–') {
            sentence[i] == '-'
        }
    }
    return sentence
}

function taggify(arraySentences) {

    var TreeBankTok = new natural.TreebankWordTokenizer();
    var QAs = []
    var whoq1 = []
    var whoq2 = []
    var whereq1 = []
    var whereq2 = []
    var whenq1 = []
    var whenq2 = []


    //For each sentence within the text,
    for (var i = 0; i < arraySentences.length; i++) {
        var sentence = preProcessing(arraySentences[i])
        //we first tokenize the sentence to convert the string to an array of treebank tokens
        var tokenizedSent = TreeBankTok.tokenize(sentence);
        //we then use the tagger to assign the treebank tokens with a part of speech(noun, verb, adverb, adj, etc.) 
        var taggedTokSent = tagger.tag(tokenizedSent)
        //now that our sentences are tagged, we will use a form of entity recognition to give more specific parts of speech (for example the word 'Paris' would transform from 'NNP' to 'LOC')
        //to do this we use the compromise library which will return arrays of different elements, in order to convert into specific WH questions 
        var doc = nlp(sentence)
        //people -> Who
        people = (doc.people().out('array'))
        //places -> Where
        places = (doc.places().out('array'))
        // dates -> When
        dates = (doc.dates().out('array'))
        //values -> How many
        values = (doc.values().out('array'))

        // organizations = (doc.organizations().out('array'))

        var whoQAs = matchItems(people, taggedTokSent, labelPerson)
        var whereQAs = matchItems(places, taggedTokSent, labelLocation)
        var whenQAs = matchItems(dates, taggedTokSent, labelDate)
        //var howManyQAs = valobjTag(taggedTokSent)


        if (whoQAs !== null && whoQAs !== undefined && whoQAs.length > 0) {
            whoQAs[0].push(i)
            whoq1.push(whoQAs[0])
            whoQAs[1].push(i)
            whoq2.push(whoQAs[1])
        }

        if (whereQAs !== null && whereQAs !== undefined && whereQAs.length > 0) {
            whereQAs[0].push(i)
            whereq1.push(whereQAs[0])
            whereQAs[1].push(i)
            whereq2.push(whereQAs[1])
        }

        if (whenQAs !== null && whenQAs !== undefined && whenQAs.length > 0) {
            whenQAs[0].push(i)
            whenq1.push(whenQAs[0])
            whenQAs[1].push(i)
            whenq2.push(whenQAs[1])
        }

    }
    var allWhoQAs = whoq1.concat(whoq2)
    var allwhereQAs = whereq1.concat(whereq2)
    var allwhenQAs = whenq1.concat(whenq2)

    QAs.push(allWhoQAs)
    QAs.push(allwhereQAs)
    QAs.push(allwhenQAs)
    return QAs
}

function questionize(sentence, label) {
    switch (label) {
        case labelPerson:
            var whoQAs = whoQuestion(sentence);
            return whoQAs
            break;
        case labelLocation:
            var whereQAs = whereQuestion(sentence);
            return whereQAs
            break;
        case labelDate:
            var whenQAs = whenQuestion(sentence);
            return whenQAs
            break;
    }
}

// matchItems(organizations, taggedTokSent, labelOrganization)
function matchItems(group, taggedTokSent, label) {
    for (var y = 0; y < group.length; y++) {
        var groupItem = group[y]
        var wordArray = groupItem.split(" ");
        for (var x = 0; x < wordArray.length; x++) {
            for (var z = 0; z < taggedTokSent.length; z++) {
                if (wordArray[x].toUpperCase() == taggedTokSent[z][0].toUpperCase()) {
                    if (label == labelPerson || label == labelLocation) {
                        if (taggedTokSent[z][1] == "NNP" || taggedTokSent[z][1] == "N") {
                            taggedTokSent[z][1] = label
                        }
                    }
                    else if (label == labelDate) {
                        if (taggedTokSent[z][1] !== "DT" && taggedTokSent[z][1] !== "VBD") {
                            taggedTokSent[z][1] = label
                        }
                    }
                    else {
                        taggedTokSent[z][1] = label
                    }
                }
            }
        }
    }
    var questionAnswer = questionize(taggedTokSent, label)
    return questionAnswer
}


function whoQuestion(sentence) {
    var whoQAs = [];
    var whoQAs2 = [];
    var tokenSentence = ""
    var arrQuestions = []
    var arrAnswers = []
    var arrQandA = []
    var question
    for (var word = 0; word < sentence.length; word++) {
        tokenSentence = tokenSentence + sentence[word][1] + " "
    }
    var regex1 = new RegExp('(NNP\.PERS)+ \(.*\) VBD DT');
    var regex2 = new RegExp('(NNP\.PERS)+ VBD DT');
    if (regex1.test(tokenSentence) == true || regex2.test(tokenSentence) == true) {

        var person = ""
        var location = ""
        var subject = ""
        var verb
        var locationT = ""
        var bool = false
        var verbBool = false
        var inBool = false
        var locationBool = false
        var subjSet = false
        var sentenceActionArray = []
        var sentenceAction = ""

        for (var word = 0; word < sentence.length; word++) {
            if (sentence[word][1] == labelPerson && subjSet == false) {
                person = person + sentence[word][0] + " "
                bool = true
            }
            else if (bool == true && verbBool == false) {
                if (sentence[word][1] == "VBN") {
                    verb = sentence[word][0]
                    verbBool = true
                }
                else if (sentence[word][1] == "VBD") {
                    verb = sentence[word][0]
                    verbBool = true
                }
                subjSet = true
            }
            else if (verbBool == true) {
                if (sentence[word][1] !== ".") {
                    sentenceActionArray.push(sentence[word][0])
                }
            }
        }
        if (person !== "" && verb !== undefined) {
            for (var sentenceAct = 0; sentenceAct < sentenceActionArray.length; sentenceAct++) {
                sentenceAction = sentenceAction + sentenceActionArray[sentenceAct] + " "
            }
            if (verb == "was" || verb == "is") {
                var question1 = "Who " + verb + " " + person + "?"
                var answer1 = capitalizeFirstLetter(sentenceAction)
            }
            else {
                var question1 = "What did " + person + " " + verb + "?"
                var answer1 = capitalizeFirstLetter(sentenceAction)
            }

            var question2 = "Who " + verb + " " + sentenceAction + "?"
            var answer2 = person

        }
    }
    if (question1 !== undefined && answer1 !== undefined) {
        whoQAs.push(question1)
        whoQAs.push(answer1)
    }
    if (question2 !== undefined && answer2 !== undefined) {
        whoQAs2.push(question2)
        whoQAs2.push(answer2)
    }
    if (whoQAs.length > 0) {
        return [whoQAs, whoQAs2];
    }

}

function whereQuestion(sentence) {
    var whereQAs = [];
    var whereQAs2 = [];
    var tokenSentence = ""
    var arrQuestions = []
    var arrAnswers = []
    var arrQandA = []
    var question
    for (var word = 0; word < sentence.length; word++) {
        tokenSentence = tokenSentence + sentence[word][1] + " "
    }
    var regex1 = new RegExp('((NNP\.LOC)+|NNP+|(NNP\.PERS)+|NNPS+|NN+|N+) (VB.*) .* NNP.LOC');
    var regex1InVariation = new RegExp('((NNP\.LOC)+|NNP+|(NNP\.PERS)+|NNPS+|NN+|N+) (VB.*) .* IN NNP.LOC');
    if (regex1.test(tokenSentence) == true || regex1InVariation.test(tokenSentence) == true) {

        var person = ""
        var location = ""
        var subject = ""
        var verb
        var locationT = ""
        var bool = false
        var verbBool = false
        var inBool = false
        var locationBool = false
        var subjSet = false
        var sentenceActionArray = []
        var sentenceAction = ""

        for (var word = 0; word < sentence.length; word++) {
            if (sentence[word][1] == labelPerson && subjSet == false) {
                person = person + sentence[word][0] + " "
                bool = true
            }
            else if (sentence[word][1] == labelLocation && subjSet == false) {
                location = location + sentence[word][0] + " "
                bool = true
            }
            else if ((sentence[word][1] == "NNP" || sentence[word][1] == "NN" || sentence[word][1] == "N" || sentence[word][1] == "NNPS") && subjSet == false) {
                subject = subject + sentence[word][0] + " "
                bool = true
            }
            else if (bool == true && verbBool == false) {
                if (sentence[word][1] == "VBN") {
                    verb = sentence[word][0]
                    verbBool = true
                }
                else if (sentence[word][1] == "VBD") {
                    verb = sentence[word][0]
                    verbBool = true
                }
                subjSet = true
            }
            else if (verbBool == true) {
                if (sentence[word][1] == labelLocation && locationBool == false) {
                    locationT = locationT + sentence[word][0] + " "
                    locationBool = true
                }
                if (locationBool == false && sentence[word][1] !== ".") {
                    sentenceActionArray.push(sentence[word][0])
                }
            }
        }
        if ((location !== "" || person !== "" || subject !== "") && verb !== undefined && locationT !== "") {
            if (regex1InVariation.test(tokenSentence) == true) {
                for (var sentenceAct = 0; sentenceAct < sentenceActionArray.length - 1; sentenceAct++) {
                    sentenceAction = sentenceAction + sentenceActionArray[sentenceAct] + " "
                }
            }
            else if (regex1.test(tokenSentence) == true) {
                for (var sentenceAct = 0; sentenceAct < sentenceActionArray.length; sentenceAct++) {
                    sentenceAction = sentenceAction + sentenceActionArray[sentenceAct] + " "
                }
            }
            if (location !== "") {
                var question1 = "Where did " + location + natural.PorterStemmer.stem(verb) + " " + sentenceAction + "?"
                var answer1 = locationT
                var question2 = "Which region " + verb + " " + sentenceAction + "in" + " " + locationT + "?"
                var answer2 = location
            }
            else if (person !== "") {
                var question1 = "Where did " + person + natural.PorterStemmer.stem(verb) + " " + sentenceAction + "?"
                var answer1 = locationT
                var question2 = "Who " + verb + " " + sentenceAction + "in" + " " + locationT + "?"
                var answer2 = person
            }
            else if (subject !== "") {
                var question1 = "Where did the " + subject + natural.PorterStemmer.stem(verb) + " " + sentenceAction + "?"
                var answer1 = locationT
                var question2 = "What " + verb + " " + sentenceAction + "in" + " " + locationT + "?"
                var answer2 = "(The) " + subject
            }
        }
    }
    if (question1 !== undefined && answer1 !== undefined) {
        whereQAs.push(question1)
        whereQAs.push(answer1)
    }
    if (question2 !== undefined && answer2 !== undefined) {
        whereQAs2.push(question2)
        whereQAs2.push(answer2)
    }
    if (whereQAs.length > 0) {
        return [whereQAs, whereQAs2];
    }

}

function whenQuestion(sentence) {
    var tokenSentence = ""
    var arrQuestions = []
    var arrAnswers = []
    var arrQandA = []
    var whenQAs = [];
    var whenQAs2 = [];
    for (var word = 0; word < sentence.length; word++) {
        tokenSentence = tokenSentence + sentence[word][1] + " "
    }
    var regex1 = new RegExp('NNP.PERS (VB.*) IN (DATE)+');
    var regex2 = new RegExp('((NNP\.LOC)+|NNP+|(NNP\.PERS)+|NNPS+|NN+|N+) (VB.*) .* IN DATE');
    var regex2Between = new RegExp('((NNP\.LOC)+|NNP+|(NNP\.PERS)+|NNPS+|NN+|N+) (VB.*) .* IN DATE CC DATE');
    var regex3 = new RegExp('((NNP\.LOC)+|NNP+|(NNP\.PERS)+|NNPS+|NN+|N+)*. \(DATE .* DATE\)');
    // var regex3 = new RegExp('((NNP\.LOC)+|NNP+|NNP.PERS) (VB.*) .* (NN|NNP.LOC) .* IN DATE CC DATE');
    if (regex1.test(tokenSentence) == true) {
        var personBool = false;
        var verb
        var date
        var person = ""
        var IN
        var verbBool = false
        var inBool = false
        for (var word = 0; word < sentence.length; word++) {
            if (sentence[word][1] == labelPerson) {
                person = person + sentence[word][0] + " "
                personBool = true
            }
            else {
                if (personBool == true && sentence[word][1] == "VBD") {
                    verb = sentence[word][0]
                    verbBool = true
                }
                else {
                    if (sentence[word][1] == "IN" && verbBool == true) {
                        IN = sentence[word][0]
                        inBool = true
                    }
                    else {
                        if (sentence[word][1] == labelDate) {
                            date = sentence[word][0]
                        }
                        inBool = false
                    }
                    verbBool = false
                }
                personBool = false
            }
        }
        if (date !== undefined && verb != undefined && person !== undefined) {
            var question1 = "When did " + person + verb + " ?"
            var answer1 = date
            var question2 = "Who " + verb + " " + IN + " " + date + " ?"
            var answer2 = person
        }
    }
    if (regex2.test(tokenSentence) == true || regex2Between.test(tokenSentence) == true) {

        var person = ""
        var location = ""
        var subject = ""
        var verb
        var date = ""
        var bool = false
        var verbBool = false
        var inBool = false
        var dateBool = false
        var subjSet = false
        var sentenceActionArray = []
        var sentenceAction = ""

        for (var word = 0; word < sentence.length; word++) {
            if (sentence[word][1] == labelPerson && subjSet == false) {
                person = person + sentence[word][0] + " "
                bool = true
            }
            else if (sentence[word][1] == labelLocation && subjSet == false) {
                location = location + sentence[word][0] + " "
                bool = true
            }
            else if ((sentence[word][1] == "NNP" || sentence[word][1] == "NN" || sentence[word][1] == "N" || sentence[word][1] == "NNPS") && subjSet == false) {
                subject = subject + sentence[word][0] + " "
                bool = true
            }
            else if (bool == true && verbBool == false) {
                if (sentence[word][1] == "VBN") {
                    verb = sentence[word][0]
                    verbBool = true
                }
                else if (sentence[word][1] == "VBD") {
                    verb = sentence[word][0]
                    verbBool = true
                }
                subjSet = true
            }
            else if (verbBool == true) {
                if (sentence[word][1] == "IN") {
                    inBool = true
                }
                if (sentence[word][1] == labelDate && inBool == true && dateBool == false) {
                    date = date + sentence[word][0] + " "
                    dateBool = true
                }
                if (dateBool == false && sentence[word][1] !== ".") {
                    if (sentence[word][1] !== "IN") {
                        inBool = false
                    }
                    sentenceActionArray.push(sentence[word][0])
                }
            }
        }
        if ((location !== "" || person !== "" || subject !== "") && verb !== undefined && date !== "") {
            for (var sentenceAct = 0; sentenceAct < sentenceActionArray.length - 1; sentenceAct++) {
                sentenceAction = sentenceAction + sentenceActionArray[sentenceAct] + " "
            }
            if (location !== "") {
                var question1 = "When did " + location + natural.PorterStemmer.stem(verb) + " " + sentenceAction + "?"
                var answer1 = date
                var question2 = "Which region " + verb + " " + sentenceAction + " " + "in" + " " + date + "?"
                var answer2 = location
            }
            else if (person !== "") {
                var question1 = "When did " + person + natural.PorterStemmer.stem(verb) + " " + sentenceAction + "?"
                var answer1 = date
                var question2 = "Who " + verb + " " + sentenceAction + " " + "in" + " " + date + "?"
                var answer2 = person
            }
            else if (subject !== "") {
                var question1 = "When did the " + subject + natural.PorterStemmer.stem(verb) + " " + sentenceAction + "?"
                var answer1 = date
                var question2 = "What " + verb + " " + sentenceAction + " " + "in" + " " + date + "?"
                var answer2 = "(The) " + subject
            }
        }
    }
    else if (regex3.test(tokenSentence) == true) {
        var person = ""
        var location = ""
        var subject = ""
        var date1 = ""
        var date2 = ""
        var bool = false
        var paranthesisBool1 = false
        var paranthesisBool2 = false
        var subjSet = false
        var toBool = false

        for (var word = 0; word < sentence.length; word++) {
            if (sentence[word][1] == labelPerson && subjSet == false) {
                person = person + sentence[word][0] + " "
                bool = true
            }
            else if (sentence[word][1] == labelLocation && subjSet == false) {
                location = location + sentence[word][0] + " "
                bool = true
            }
            else if ((sentence[word][1] == "NNP" || sentence[word][1] == "NN" || sentence[word][1] == "N" || sentence[word][1] == "NNPS") && subjSet == false) {
                subject = subject + sentence[word][0] + " "
                bool = true
            }
            else if (bool == true && paranthesisBool1 == false) {
                if (sentence[word][1] == "(") {
                    paranthesisBool1 = true

                }

            }
            else if (paranthesisBool1 == true && toBool == false) {
                if (sentence[word][1] == labelDate) {
                    date1 = date1 + sentence[word][0] + " "
                }
                else {
                    toBool = true
                }
            }
            else if (toBool == true) {
                if (sentence[word][1] == labelDate) {
                    date2 = date2 + sentence[word][0] + " "
                }
            }
        }
        if ((location !== "" || person !== "" || subject !== "") && date1 !== "" && date2 !== "") {
            if (location !== "") {
                var question1 = "When was " + location + "established?"
                var answer1 = date1
                var question2 = "When did " + location + "end?"
                var answer2 = date2
            }
            else if (person !== "") {
                var question1 = "When was " + person + "born?"
                var answer1 = date1
                var question2 = "When did " + person + "die?"
                var answer2 = date2
            }
            else if (subject !== "") {
                var question1 = "When did the " + subject + "start?"
                var answer1 = date1
                var question2 = "When did the " + subject + "end?"
                var answer2 = date2
            }
        }
    }



    if (question1 !== undefined && answer1 !== undefined) {
        whenQAs.push(question1)
        whenQAs.push(answer1)

    }
    if (question2 !== undefined && answer2 !== undefined) {
        whenQAs2.push(question2)
        whenQAs2.push(answer2)
    }

    if (whenQAs.length > 0) {
        return [whenQAs, whenQAs2]
    }

}


function valobjTag(taggedTokSent) {
    var howManyQAs = [];
    var who = false
    valobjnum = 0
    //conversion for values
    //vals is an array of all values and value objects found within the sentence. This system is set up to save only values which have value objects associated with it.
    vals = []
    verbs = []
    verbCounts = []
    //if there is at least 1 value type for the sentence
    if (values[0] !== null && values[0] !== undefined) {
        //loop through all values
        valToString = ""
        for (var valuesCount = 0; valuesCount < values.length; valuesCount++) {
            var checkNextVal = false;
            valString = ""
            //loop through the sentence 
            var verb = ""
            for (var count = 0; count < taggedTokSent.length; count++) {
                sentVals = []
                //if the word in the sentence is a verb of any type, we add it, along with it's numeric position in the sentence
                if (valuesCount == 0) {
                    var verbValues = []
                    var re = new RegExp('VB.*');
                    if (re.test(taggedTokSent[count][1]) == true) {
                        if (taggedTokSent[count][1] != "VBN") {
                            var verbC = nlp(taggedTokSent[count][0])
                            var verb = verbC.sentences().toPastTense().out('text')
                        }
                        else {
                            verb = taggedTokSent[count][0]
                        }

                        verbValues.push(verb)
                        verbValues.push(count)
                        verbCounts.push(count)
                        verbs.push(verbValues)
                    }

                }
                //sometimes the same word can come up as both date and value. We make sure  this is not the case (as more likely to be a date if tagged as both)
                if (taggedTokSent[count][1] !== labelDate) {
                    //if the value we have found is more than 1 word (e.g 'four hundred people') 
                    if (values[valuesCount].indexOf(' ') >= 0) {
                        //we split each word and put in array
                        var wordArray = values[valuesCount].split(" ");
                        //we loop the array
                        for (var word = 0; word < wordArray.length; word++) {
                            //if the word in the array is equal to the word in the sentence
                            if (taggedTokSent[count][0].toUpperCase() === wordArray[word].toUpperCase()) {
                                //and if that word is not the last word in word array
                                if (word < wordArray.length - 1) {
                                    //we transform the label to value
                                    taggedTokSent[count][1] = labelValue
                                    checkNextVal = true
                                    valString = valString + taggedTokSent[count][0] + " "
                                }
                                //and if the word is the last word in the array, it is a value object (e.g. 'people' in 'four hundred people' would correspond to the type of object, rather than a numeric value)
                                else if (checkNextVal == true) {
                                    if (valToString != "") {
                                        taggedTokSent[count][1] = labelValueObject
                                        checkNextVal = false
                                        sentVals.push(valToString + valString + taggedTokSent[count][0])
                                        sentVals.push(count)
                                    }
                                    else {
                                        //we transform the label to value object
                                        taggedTokSent[count][1] = labelValueObject
                                        checkNextVal = false
                                        sentVals.push(valString + taggedTokSent[count][0])
                                        sentVals.push(count)
                                    }
                                }
                            }
                        }
                    }
                    //if the value we have found is just 1 word (e.g. '150' in 'more than 150 were injured')*
                    //*and the word from values matches the tokenized sentence, then that is transformed into value
                    else if (taggedTokSent[count][0].toUpperCase() === values[valuesCount].toUpperCase()) {
                        taggedTokSent[count][1] = labelValue
                        checkNextVal = true
                        valString = valString + taggedTokSent[count][0] + " "
                    }
                    //*and the word is an adjective and checkNextVal is true, then checkNextVal is still true, e.g. ('two identical monkeys' -> 'identical' is used to describe the second element of the value)
                    else if ((taggedTokSent[count][1] === "JJ") && checkNextVal == true) {
                        checkNextVal = true
                    }
                    //*and the word is a noun (singular or plural), and checkNextVal is true, then that word is a value object, e.g. only '360' in '360 light-years' is detected as a value by the NER, 
                    //but it is obvious that 'light-years' is the value object
                    else if (((taggedTokSent[count][1] === "NNS") || (taggedTokSent[count][1] === "N")) && checkNextVal == true) {
                        taggedTokSent[count][1] = labelValueObject
                        checkNextVal = false
                        sentVals.push(valString + taggedTokSent[count][0])
                        sentVals.push(count)
                    }
                    //*and the word is of type TO, and checkNextVal is true, then that word will become part of the value (e.g.'to' in '20 to 40 people')
                    else if (taggedTokSent[count][1] === "TO" && checkNextVal == true) {
                        taggedTokSent[count][1] = labelValue
                        checkNextVal = false
                        valToString = valString + taggedTokSent[count][0] + " "

                    }
                    else {
                        checkNextVal = false
                    }
                }
                if (sentVals[0] !== null && sentVals[0] !== undefined) {
                    vals.push(sentVals)
                }
            }
        }
    }



    for (var x = 0; x < vals.length; x++) {
        value = ""
        valueObject = ""
        valueCount = vals[x][1]
        howManyQA = []
        verb = ""


        var wordArray = vals[x][0].split(" ");

        for (var word = 0; word < wordArray.length; word++) {
            if (word == wordArray.length - 1) {
                valueObject = wordArray[word]
            }
            else {
                valueCount--
                if (value == "") {
                    value = wordArray[word]
                }
                else {
                    value = value + " " + wordArray[word]
                }

            }
        }

        var closestNum = closest(valueCount, verbCounts)
        for (var y = 0; y < verbs.length; y++) {
            if (verbs[y][1] == closestNum) {
                verb = verbs[y][0]
                verbs[y][1] == 999
            }
        }
        howManyQ = "How many " + valueObject + " " + verb + " ?"
        howManyQA.push(howManyQ)
        howManyQA.push(value)
        howManyQAs.push(howManyQA)
        if (who == true) {
            HMQuestion(taggedTokSent)
        }
    }

    HMQuestion(taggedTokSent)
}




function HMQuestion(sentence) {
    sentenceTokens = ""
    for (var x = 0; x < sentence.length; x++) {
        sentenceTokens = sentenceTokens + sentence[x][1] + " "
    }
}


function closest(num, arr) {
    var curr = arr[0];
    var diff = Math.abs(num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    var text = "";
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
        text = text + chunk;
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        response.on('error', (err) => {
            console.error(err);
        });

        response.statusCode = 200;

        response.setHeader('Content-Type', 'application/json');

        // Website you wish to allow to connect
        // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        response.setHeader('Access-Control-Allow-Origin', 'https://questiongeneratingwebsite.herokuapp.com');

        // Request methods you wish to allow
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        response.setHeader('Access-Control-Allow-Credentials', true);


        var arrayQAs = JSON.stringify(sentenceArray(body));

        response.write(arrayQAs);

        response.end();

    });
}).listen(port);

