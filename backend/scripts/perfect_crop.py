import cv2
from PIL import Image

def process_perfect_logo(input_path, output_path, is_dark_bg=False):
    # 1. USE OPENCV TO FIND PERFECT BOUNDING BOX
    cv_img = cv2.imread(input_path, cv2.IMREAD_GRAYSCALE)
    if cv_img is None:
        print(f"Error cargando {input_path}")
        return

    # Binarizar para separar diseño del fondo ruidoso/sólido
    if is_dark_bg:
        _, thresh = cv2.threshold(cv_img, 40, 255, cv2.THRESH_BINARY)
    else:
        # Fondo blanco, texto oscuro
        _, thresh = cv2.threshold(cv_img, 200, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        print(f"Error: No se detectó diseño en {input_path}")
        return

    # Buscar los límites de todo el texto/gráfico real ignorando manchas diminutas
    min_x, min_y = cv_img.shape[1], cv_img.shape[0]
    max_x, max_y = 0, 0
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w > 10 and h > 10 and w < cv_img.shape[1] * 0.95:
            if x < min_x: min_x = x
            if y < min_y: min_y = y
            if x + w > max_x: max_x = x + w
            if y + h > max_y: max_y = y + h
            
    # Darle un margen de respiración
    padding = 15
    h_img, w_img = cv_img.shape
    left = max(0, min_x - padding)
    top = max(0, min_y - padding)
    right = min(w_img, max_x + padding)
    bottom = min(h_img, max_y + padding)

    # 2. USE PILLOW FOR BEAUTIFUL TRANSLUCENT SHADOW EXTRACTION
    img = Image.open(input_path).convert("RGBA")
    
    # Recortar usando el bounding box de Alta Precisión de OpenCV
    cropped = img.crop((left, top, right, bottom))
    datas = cropped.getdata()
    
    newData = []
    for item in datas:
        # Luma
        avg = int(item[0] * 0.299 + item[1] * 0.587 + item[2] * 0.114)
        
        if is_dark_bg:
            # original = texto blanco sobre fondo oscuro. 
            # Output = blanquecino brillante. Alpha dependiente de Luma
            alpha = avg
            # Si el pixel es muy oscuro, matarlo (transparente)
            if alpha < 30: alpha = 0
            newData.append((255, 255, 255, alpha))
        else:
            # original = fondo blanco, texto negro. 
            # Output = negro profundo. Alpha dependiente de oscuridad.
            alpha = 255 - avg
            # Si el pixel es muy blanco, matarlo
            if alpha < 30: alpha = 0
            # Pintarlo de color "Slate" oscuro (hex #0f172a / rgb 15,23,42)
            newData.append((15, 23, 42, alpha))
            
    cropped.putdata(newData)
    cropped.save(output_path, "PNG")
    print(f"✅ ¡Gema procesada! => {output_path} (Tamaño cortado: {right-left}x{bottom-top})")

print("Iniciando algoritmo CVPillow Híbrido...")
process_perfect_logo("logo_blanco.png", "../../frontend/public/logo_blanco_clean.png", is_dark_bg=False)
process_perfect_logo("logo_negro.png", "../../frontend/public/logo_negro_clean.png", is_dark_bg=True)
