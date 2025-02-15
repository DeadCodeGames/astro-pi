# **Mission Space Lab**

## **1. Cieľ projektu**
### 🔹 Hlavné body:
- Výpočet lineárnej rýchlosti stanice ISS za použitia Rasphberry Pi.
- Vyhodnocovanie pohybu pomocou Python knižnice OpenCV
- Zaznamenávanie fotografii pomocou kamerového modulu 

Cieľom projektu **Mission Space Lab** je vytvoriť program, ktorý zaznamena sériu fotografii a následne vyhodnotí rýchlosť pohybu.

---

## **2. Problémy s nedostatkom údajov potrebných na výpočty, nefunčnosť prostredia**
### 🔹 Hlavné problémy:
- Nedostatok údajov na dynamické zistenie výšky
- Nefunkčnosť online emulačného prostredia
- Neprístupnosť fotografických materiálov s potrebným rozlíšením  
- Nesprávny výpočet GSD na strane AstroPi organizácie

### **2.1 Nepresný výpočet výšky**
- Z dôvodu nefunkčnosti akcelerometru sme nemohli vypočítať výšku dynamicky

### **2.2 Nefunkčnosť online emulačného prostredia**
- Pri testovaní online emulačného prostredia sa nám vyskytli zo strany prostredia nezmyselné chyby, a preto sme nedokázali testovacie prostredie použiť 

### **2.3 Neprístupnosť fotografických materiálov s potrebným rozlíšením**
- Zistili sme, že fotky stiahnuté cez Astro-pi-replay boli len v rozlíšení 1412x1412 pixelov.
- S touto hodnotou sme najprv počítali, a vychádzali nám hodnoty blízko považovaného priemeru rýclosti ISS.
- Potrebovali sme, aby ale program fungoval pre rozlíšenie fotiek 4056x3040.

### **2.4 Nesprávny výpočet GSD na strane AstroPi organizácie**
- Všimli sme si, že na stránke AstroPi bola hodnota GSD 12648, a to nie je správna hodnota pre použitú kameru.  


✅ **Riešenia:**
- Použitie statickej výšky
- Používanie len Thonny
- Stiahnutie datasetov cez AstroPi a prerátanie GSD
- Diskusia s Janem Spratkem
---

## **3. Funkčný program: Výpočet približnej rýchlosti ISS**
### 🔹 Použité techniky:
- Čítanie RGB hodnôt zo senzora.
- Animácia rastliny zobrazujúca jej rast.
- Automatická úprava pozadia podľa svetelných podmienok.

### **3.1 Použitie statickej výšky**
- Na vyriešenie problému, ktorý nám zabraňoval vypočítať výšku dynamicky sme použili staticku výšku, ktorú sme určili ako priemernú výšku ISS = 420 000m

### **3.2 Používanie len Thonny**
- Kvôli nefunkčnosti emulátoru sme boli odkázaní len na Thonny, ktorý nám na potrebné veci postačil

### **3.3 Stiahnutie datasetov cez AstroPi a prerátanie GSD**
- Na vyriešenie problému z rozlíšením fotky sme si stiahli 4 datasety so správnym rozlíšením a na nich ďalej testovali kód

### **3.4 Diskusia s Janem Spratkem**
- Ohľadom problému s výpočtom GSD sme mali konzultáciu s Janem Spratkem.


### **3.5 Ukážka kódu**
#### **3.5.1 Detekcia oblakov**
```py
    def detect_clouds(image):
        thresh = cv2.adaptiveThreshold( # Identifikujeme blede regiony (oblaky)
            image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        # Vytvorime na ne masku a neskor sa ich snazime ignorovat
        cloud_mask = cv2.bitwise_not(thresh)
        return cloud_mask
```

#### **3.5.2 Fotenie obrázkov**
```py
for i in range(1, 41): # Hlavna funkcia v ktorej vsetko vypocitame
    cam.take_photo(f"image{i}.jpg")
    cam.take_photo(f"image{i+1}.jpg")
    image1 = f"image{i}.jpg"
    image2 = f"image{i+1}.jpg"

    time_difference = get_time_difference(image1, image2)
    image_1_cv, image_2_cv = convert_to_cv(image1, image2)
    
    keypoints_1, keypoints_2, descriptors_1, descriptors_2 = calculate_features(
        image_1_cv, image_2_cv, 1000
    )
    
    if descriptors_1 is None or descriptors_2 is None:
        continue

    matches = calculate_matches(descriptors_1, descriptors_2)
    coordinates_1, coordinates_2 = find_matching_coordinates(
        keypoints_1, keypoints_2, matches
    )
    
    average_feature_distance = calculate_mean_distance(coordinates_1, coordinates_2)
    speed = calculate_speed_in_kmps(
        average_feature_distance, 10853.345, time_difference
    )

    if speed is not None:
        valid_speeds.append(speed)
        print(f"{speed:.5g}")  
                                        
if valid_speeds:
    final_speed = sum(valid_speeds) / len(valid_speeds)
    with open("result.txt", "w") as file:
        file.write(f"{final_speed:.5g}")
```

