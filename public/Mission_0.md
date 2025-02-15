# **Mission Zero**

## **1. Cieľ projektu**

### 🔹 Hlavné body:

- Zobrazenie obrázkov na Raspberry Pi umiestnenom na medzinárodnej stanici ISS.
- Dynamické prispôsobenie farieb na základe senzora svetla a farby.

Cieľom projektu *Mission Zero* je vytvoriť program, ktorý zobrazí sériu vizualizácií na Raspberry Pi LED module s rozmermi 8x8 RGB LED umiestnenom na ISS. Farby na obrazovke sa prispôsobia okolitemu osvetleniu vďaka senzoru farieb a jasu.

---

## **2. Implementácia vizualizácie**

### 🔹 Plán vizualizácie:

1. Nakresliť mimozemskú rastlinu č. 1.
2. Napísať názov nášho týmu.
3. Nakresliť mimozemskú rastlinu č. 2.

### 🔹 Technické riešenie:

- Importovanie knižnic a nastavenie svetelného senzora.
- Definovanie počiatočných premenných.
- Použitie cyklov na vykreslenie pixelov rastliny.
- Zobrazenie animácie rastu rastlín postupným vypisovaním pixelov.

Príklad zapisovania pixelov rastliny:

```python
plant_states = [
  [(3,6), (4,6)],  # Rast rastliny
  [(3,5), (4,5)],
  [(3,4), (4,4)],
  [(3,3), (4,3)],
  [(3,2), (4,2)],
  [(3,1), (4,1)]
]
```

Čoskoro sa však ukázalo, že tento zápis mal jednu zásadnú chybu.

---

## **3. Problémy s presnosťou farieb**

- Používanie funkcií na zmenu farby pixelov vo formáte `(x, y, colour)` nezobrazovalo presne očakávanú farbu.
- Pre istotu zhodnosti výstupu sa použili vopred definované farby:
  
  ```python
  Red = (255,0,0)
  Green = (0,255,0)
  White = (255,255,255)
  ```

- Toto sa avšak preukázalo ako veľmi limitujúce, a potrebovali sme nájsť lepší spôsob

👉 **Riešenia:**

- Dynamická úprava farieb podľa senzora.
  - Kód by bol pri tomto riešení jednoduchší, ale za cenu **straty kontroly nad farbami**.
- Testovanie rôznych spôsobov zapisovania framov animácie.
  - Kód bol pri tomto riešení **komplexnejší**, ale hlavne sme vďaka tejto forme zápisu mali **úplnú kontrolu nad farbami výstupu**.

---

## **4. Funkčný program: Spracovanie farieb a vizualizácie**

### **4.1 Ukážka kódu**

```python
# Nastavenie farby pozadia podľa senzora
if light_level < 100:
    background_color = (0, 0, 255)  # Modrá pre tmu
else:
    background_color = (255, 255, 255)  # Biela pre svetlo
```

### **4.2 Matrix zápis framu**

```python
plant_stages = [
 [bg, bg, bg, bg, bg, bg, bg, bg,
  bg, bg, bg, bg, bg, bg, bg, bg,
  bg, bg, bg, bg, bg, bg, bg, bg,
  bg, bg, bg, bg, bg, bg, bg, bg,
  bg, bg, bg, bg, bg, bg, bg, bg,
  bg, bg, bg, bg, bg, bg, bg, bg,
  bg, bg, bg, bg, bg, bg, bg, bg,
  bg, bg, bg, bg, bg, bg, bg, bg], 
  ... ]
```