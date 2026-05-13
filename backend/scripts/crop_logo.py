from PIL import Image, ImageChops

def crop_image(input_path, output_path):
    try:
        # Abrir la imagen original
        img = Image.open(input_path).convert("RGB")
        
        # Asumir que el píxel (0,0) es el color del fondo aburrido gigante
        bg_color = img.getpixel((0,0))
        bg = Image.new("RGB", img.size, bg_color)
        
        # Encontrar diferencia de pixeles entre la imagen real y una lisa de ese fondo
        diff = ImageChops.difference(img, bg)
        bbox = diff.getbbox()
        
        if bbox:
            # Añadir un pequeñito buffer (10 pixeles) para no cortar las sombras suaves
            margin = 15
            left = max(0, bbox[0] - margin)
            top = max(0, bbox[1] - margin)
            right = min(img.width, bbox[2] + margin)
            bottom = min(img.height, bbox[3] + margin)
            
            cropped = img.crop((left, top, right, bottom))
            cropped.save(output_path, "PNG")
            print(f"✅ EXITO: {input_path} ha sido recortada al máximo! Bbox: {left},{top},{right},{bottom}")
        else:
            print(f"❌ FALLO en {input_path}: No pude encontrar nada diferente al fondo.")
            
    except Exception as e:
        print(f"Error procesando {input_path}: {e}")

if __name__ == "__main__":
    print("Iniciando auto-corte de bordes inútiles...")
    crop_image("logo_blanco.png", "../../frontend/public/logo_blanco_cropped.png")
    crop_image("logo_negro.png", "../../frontend/public/logo_negro_cropped.png")
