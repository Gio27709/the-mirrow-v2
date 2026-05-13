import cv2

def vectorize(img_path, out_svg, invert=False, fill_color="currentColor"):
    print(f"Vectorizando {img_path} hacia {out_svg}...")
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f"Esperando imagen {img_path}...")
        return
        
    if invert:
        _, thresh = cv2.threshold(img, 128, 255, cv2.THRESH_BINARY_INV)
    else:
        _, thresh = cv2.threshold(img, 128, 255, cv2.THRESH_BINARY)
        
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return
        
    # Calcular Bounding Box global ignorando el fondo enorme
    h_img, w_img = img.shape
    min_x, min_y = w_img, h_img
    max_x, max_y = 0, 0
    
    valid_contours = []
    
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w > w_img * 0.95 and h > h_img * 0.95:
            continue
            
        valid_contours.append(contour)
        if x < min_x: min_x = x
        if y < min_y: min_y = y
        if x + w > max_x: max_x = x + w
        if y + h > max_y: max_y = y + h

    if not valid_contours:
        return
        
    width = max_x - min_x
    height = max_y - min_y

    with open(out_svg, 'w', encoding='utf-8') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{min_x} {min_y} {width} {height}" fill="{fill_color}" fill-rule="evenodd">\n')
        f.write('  <path d="')
        for contour in valid_contours:
            for i, pt in enumerate(contour):
                vx, vy = pt[0]
                if i == 0:
                    f.write(f'M{vx},{vy} ')
                else:
                    f.write(f'L{vx},{vy} ')
            f.write('Z ')
        f.write('" />\n')
        f.write('</svg>\n')
        print(f"¡HECHO! Guardado en {out_svg}")

# Rutas listas para que el usuario coloque sus archivos:
vectorize("logo_blanco.png", "../../frontend/public/logo_light_theme.svg", invert=True, fill_color="#1f2937")
vectorize("logo_negro.png", "../../frontend/public/logo_dark_theme.svg", invert=False, fill_color="#f3f4f6")
