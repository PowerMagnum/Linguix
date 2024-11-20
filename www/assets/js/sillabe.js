class Lettera {
    constructor() {
        this.vocali = ["a", "e", "i", "o", "u", "y",
            "A", "E", "I", "O", "U", "Y",
            "à", "á", "è", "é", "ì", "í", "ò", "ó", "ù", "ú",
            "À", "Á", "È", "É", "Ì", "Í", "Ò", "Ó", "Ù", "Ú",
        ];
        this.consonanti = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "z", "x", "w",
            "B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "Z", "X", "W"
        ];

        this.dittongo = ["ia", "ie", "io", "iu", "ua", "ue", "uo", "ui", "ai", "ei", "oi", "ui", "au", "eu"];

        this.trittongo = ["iai", "iei", "uoi", "uai", "uei", "iuo"];

        this.gruppiConsonantici = [
            "br", "cr", "dr", "fr", "gr", "pr", "tr", "vr",
            "bl", "cl", "dl", "fl", "gl", "pl", "tl", "vl",
        ];

        this.gruppiDiacritici = [
            "ch", "gl", "gh"
        ];
    }

    static isVocale(carattere) {
        let L = new Lettera();
        if (L.vocali.indexOf(carattere) != -1) {
            return true;
        } else {
            return false;
        }
    }

    static isConsonante(carattere) {
        let L = new Lettera();
        if (L.consonanti.indexOf(carattere) != -1) {
            return true;
        } else {
            return false;
        }
    }

    static isOther(carattere) {
        let L = new Lettera();
        if ((L.vocali.indexOf(carattere) == -1) && (L.consonanti.indexOf(carattere) == -1)) {
            return true;
        } else {
            return false;
        }
    }

    static isGruppiConsonantici(testo) {
        let L = new Lettera();
        if (L.gruppiConsonantici.indexOf(testo) != -1) {
            return true;
        } else {
            return false;
        }
    }

    static isGruppiDiacritici(testo) {
        let L = new Lettera();
        if (L.gruppiDiacritici.indexOf(testo) != -1) {
            return true;
        } else {
            return false;
        }
    }

    static isDittongo(testo) {
        let L = new Lettera();
        if (L.dittongo.indexOf(testo) != -1) {
            return true;
        } else {
            return false;
        }
    }

    static isTrittongo(testo) {
        let L = new Lettera();
        if (L.trittongo.indexOf(testo) != -1) {
            return true;
        } else {
            return false;
        }
    }
}

class Sillabazione {
    constructor(testo) {
        this.testo = testo;
        this.listaParole = [];
        this.listaCaratteri = [];
        this.listaSillabe = [];
    }

    TestoDivisioneParole() {
        this.listaCaratteri = this.testo.split('');
        let listaTemp = [];
        for (let c = 0; c < this.listaCaratteri.length; c++) {

            if (Lettera.isOther(this.listaCaratteri[c])) {
                // Se è una parola apostrofata unisci
                if ((this.listaCaratteri[c] == "’") || (this.listaCaratteri[c] == "'")) {
                    listaTemp.push(this.listaCaratteri[c]);
                }
                // Se è uno spazio crea elemento singolo
                if (this.listaCaratteri[c] == " ") {
                    if (listaTemp.length != 0) {
                        this.listaParole.push(listaTemp.join(""));
                    }
                    listaTemp = [" "];
                }
                // Se qualunque altro carattere mettilo singolarmente
                if ((this.listaCaratteri[c] != " ") && ((this.listaCaratteri[c] != "’") || (this.listaCaratteri[c] == "'"))) {
                    this.listaParole.push(listaTemp.join(""));
                    listaTemp = [this.listaCaratteri[c]];
                }
                this.listaParole.push(listaTemp.join(""));
                listaTemp = [];
            } else {
                listaTemp.push(this.listaCaratteri[c]);
            }

        }
        return this.listaParole;
    }

    Sillaba() {
        for (let c = 0; c < this.testo.length; c++) {

            // Vocale più trittongo 
            if (Lettera.isVocale(this.testo[c]) && Lettera.isTrittongo(this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3])) {
                this.listaSillabe.push(this.testo[c]);
                this.listaSillabe.push(this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                c += 4;
            } // vocale più dittongo
            else if (Lettera.isVocale(this.testo[c]) && Lettera.isDittongo(this.testo[c + 1] + this.testo[c + 2])) {
                this.listaSillabe.push(this.testo[c]);
                this.listaSillabe.push(this.testo[c + 1] + this.testo[c + 2]);
                c += 3;
            } // vocale più altra vocale 
            else if (Lettera.isVocale(this.testo[c]) && Lettera.isVocale(this.testo[c + 1]) && !Lettera.isDittongo(this.testo[c] + this.testo[c + 1])) {
                this.listaSillabe.push(this.testo[c]);
                this.listaSillabe.push(this.testo[c + 1]);
                c += 2;
            }

            if (Lettera.isTrittongo(this.testo[c] + this.testo[c + 1] + this.testo[c + 2])) {
                this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                c += 3;
            } else if (Lettera.isDittongo(this.testo[c] + this.testo[c + 1])) {
                this.listaSillabe.push(this.testo[c] + this.testo[c + 1]);
                c += 2;
            }

            // regola 1
            if (Lettera.isVocale(this.testo[c]) && Lettera.isConsonante(this.testo[c + 1])) {
                // caso in cui ho cq
                if (Lettera.isVocale(this.testo[c]) && (this.testo[c + 1] == "c") && (this.testo[c + 2] == "q")) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1]);
                    c += 1;
                }
                // caso in cui ho una doppia
                else if (Lettera.isConsonante(this.testo[c + 1]) && (this.testo[c + 1] == this.testo[c + 2])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1]);
                    c += 1;
                }
                // Caso in cui ci sono una vocale e due consonanti non doppie, diacritici o consonantici
                else if (Lettera.isConsonante(this.testo[c + 1]) && Lettera.isConsonante(this.testo[c + 2]) && (this.testo[c + 1] != this.testo[c + 2]) && (this.testo[c + 1] != 's') && !Lettera.isGruppiConsonantici(this.testo[c + 1] + this.testo[c + 2]) && !Lettera.isGruppiDiacritici(this.testo[c + 1] + this.testo[c + 2])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1]);
                    c += 1;
                } else {
                    this.listaSillabe.push(this.testo[c]);
                }

            }
            // regola 2 Consonante e vocale (poi controllo dittonghi, trittonghi, doppie, ecc.)
            if (Lettera.isConsonante(this.testo[c]) && Lettera.isVocale(this.testo[c + 1])) {
                // caso in cui vocale più un dittongo
                if (Lettera.isDittongo(this.testo[c + 2] + this.testo[c + 3])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1]);
                    this.listaSillabe.push(this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso in cui ho trittongo
                else if (Lettera.isConsonante(this.testo[c]) && Lettera.isTrittongo(this.testo[c + 1] + this.testo[c + 2] + +this.testo[c + 3])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso in cui ho un dittongo
                else if (Lettera.isConsonante(this.testo[c]) && Lettera.isDittongo(this.testo[c + 1] + this.testo[c + 2])) {

                    // caso in cui ho cq
                    if ((this.testo[c + 3] == "c") && (this.testo[c + 4] == "q")) {
                        this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                        c += 3;
                    } else {
                        this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                        c += 2;
                    }
                }
                // caso in cui ho cq
                else if (Lettera.isConsonante(this.testo[c]) && Lettera.isVocale(this.testo[c + 1]) && (this.testo[c + 3] == "c") && (this.testo[c + 4] == "q")) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                    c += 2;
                }
                // caso in cui ho una doppia
                else if (Lettera.isConsonante(this.testo[c]) && Lettera.isVocale(this.testo[c + 1]) && Lettera.isConsonante(this.testo[c + 2]) && (this.testo[c + 2] == this.testo[c + 3])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                    c += 2;
                }
                // caso in cui ho due consonanti dopo
                else if (Lettera.isConsonante(this.testo[c]) && Lettera.isVocale(this.testo[c + 1]) && Lettera.isConsonante(this.testo[c + 2]) && Lettera.isConsonante(this.testo[c + 3]) && (this.testo[c + 2] != this.testo[c + 3]) && (this.testo[c + 2] != 's') && !Lettera.isGruppiConsonantici(this.testo[c + 2] + this.testo[c + 3]) && !Lettera.isGruppiDiacritici(this.testo[c + 2] + this.testo[c + 3])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                    c += 2;
                }
                // altro
                else {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1]);
                    c += 1;
                }
            }
            // regola 3 Gruppi consonantici 
            if (Lettera.isConsonante(this.testo[c]) &&
                Lettera.isConsonante(this.testo[c + 1]) &&
                Lettera.isVocale(this.testo[c + 2]) &&
                Lettera.isGruppiConsonantici(this.testo[c] + this.testo[c + 1])) {
                // caso in cui ho trittongo
                if (Lettera.isTrittongo(this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4]);
                    c += 4;
                }
                // caso in cui ho un dittongo
                else if (Lettera.isDittongo(this.testo[c + 2] + this.testo[c + 3])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso in cui ho cq
                else if (Lettera.isVocale(this.testo[c + 2]) && (this.testo[c + 3] == "c") && (this.testo[c + 4] == "q")) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso in cui ho una doppia
                else if (Lettera.isConsonante(this.testo[c + 3]) && (this.testo[c + 3] == this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso ol-tran-zi-sta
                else if (Lettera.isConsonante(this.testo[c + 3]) && Lettera.isConsonante(this.testo[c + 4]) && (this.testo[c + 3] != this.testo[c + 4]) && !Lettera.isGruppiConsonantici(this.testo[c + 3] + this.testo[c + 4]) && !Lettera.isGruppiDiacritici(this.testo[c + 3] + this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // altro
                else {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                    c += 2;
                }
            }
            // regola 4 Gruppi diacritici
            if (Lettera.isConsonante(this.testo[c]) &&
                Lettera.isConsonante(this.testo[c + 1]) &&
                Lettera.isVocale(this.testo[c + 2]) &&
                Lettera.isGruppiDiacritici(this.testo[c] + this.testo[c + 1])) {

                // caso in cui ho trittongo
                if (Lettera.isTrittongo(this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4]);
                    c += 4;
                }
                // caso in cui ho un dittongo
                else if (Lettera.isDittongo(this.testo[c + 2] + this.testo[c + 3])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso in cui ho cq
                else if (Lettera.isVocale(this.testo[c + 2]) && (this.testo[c + 3] == "c") && (this.testo[c + 4] == "q")) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso in cui ho una doppia
                else if (Lettera.isConsonante(this.testo[c + 3]) && (this.testo[c + 3] == this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // altro
                else {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                    c += 2;
                }
            }
            // regola 6.1 Sto, sta, ...
            if ((this.testo[c] == "s" || this.testo[c] == "S") &&
                Lettera.isConsonante(this.testo[c + 1]) && (this.testo[c + 1] != "s") &&
                Lettera.isVocale(this.testo[c + 2])) {
                // caso in cui ho trittongo
                if (Lettera.isTrittongo(this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4]);
                    c += 4;
                }
                // caso in cui ho un dittongo
                else if (Lettera.isDittongo(this.testo[c + 2] + this.testo[c + 3])) {
                    // caso in cui ho cq
                    if ((this.testo[c + 4] == "c") && (this.testo[c + 5] == "q")) {
                        this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4]);
                        c += 4;
                    } else {
                        this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                        c += 3;
                    }
                }
                // caso in cui ho cq
                else if ((this.testo[c + 3] == "c") && (this.testo[c + 4] == "q")) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso in cui ho una doppia
                else if (Lettera.isConsonante(this.testo[c + 3]) && (this.testo[c + 3] == this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // caso scal-tro
                else if (Lettera.isConsonante(this.testo[c + 3]) && Lettera.isConsonante(this.testo[c + 4]) && (this.testo[c + 3] != this.testo[c + 4]) && !Lettera.isGruppiConsonantici(this.testo[c + 3] + this.testo[c + 4]) && !Lettera.isGruppiDiacritici(this.testo[c + 3] + this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
                // altro
                else {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2]);
                    c += 2;
                }

            }
            // regola 6.2 Stra, scra, ...
            if ((this.testo[c] == "s" || this.testo[c] == "S") &&
                Lettera.isConsonante(this.testo[c + 1]) &&
                Lettera.isConsonante(this.testo[c + 2]) &&
                Lettera.isVocale(this.testo[c + 3])) {
                // caso in cui ho trittongo
                if (Lettera.isTrittongo(this.testo[c + 3] + this.testo[c + 4] + this.testo[c + 5])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4] + this.testo[c + 5]);
                    c += 5;
                }
                // caso in cui ho un dittongo
                else if (Lettera.isDittongo(this.testo[c + 3] + this.testo[c + 4])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4]);
                    c += 4;
                }
                // caso in cui ho cq
                else if ((this.testo[c + 4] == "c") && (this.testo[c + 5] == "q")) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4]);
                    c += 4;
                }
                // caso in cui ho una doppia
                else if (Lettera.isConsonante(this.testo[c + 4]) && (this.testo[c + 4] == this.testo[c + 5])) {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3] + this.testo[c + 4]);
                    c += 4;
                }
                // altro
                else {
                    this.listaSillabe.push(this.testo[c] + this.testo[c + 1] + this.testo[c + 2] + this.testo[c + 3]);
                    c += 3;
                }
            }

        }
        return this.listaSillabe;
    }
}
