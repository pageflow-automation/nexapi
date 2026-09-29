"""Static QR codes for DagDag Taxi. Run: python3 tools/make_qr.py
The contact code is a plain vCard (no URL, no redirect service), so it cannot be
re-pointed after printing and never opens a website or payment page."""
import segno, cv2, numpy as np, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "img"
PRINT = ROOT / "tools" / "out"
PRINT.mkdir(parents=True, exist_ok=True)

PHONE = "+31628695550"
VCARD = "\r\n".join([
    "BEGIN:VCARD", "VERSION:3.0",
    "N:;DagDag Taxi Culemborg",
    "FN:DagDag Taxi Culemborg",
    f"TEL;TYPE=CELL:{PHONE}",
    "END:VCARD",
])
WHATSAPP = "https://wa.me/31628695550"

def make(name, data, ecc="m"):
    qr = segno.make(data, error=ecc, micro=False)
    qr.save(OUT / f"{name}.svg", scale=10, border=4, dark="#141414", light="#ffffff", svgclass=None, lineclass=None, omitsize=True, title=None)
    png = PRINT / f"{name}.png"
    qr.save(png, scale=24, border=4, dark="#141414", light="#ffffff")
    # Verify it decodes back to exactly what we put in.
    img = cv2.imread(str(png))
    decoded, *_ = cv2.QRCodeDetector().detectAndDecode(img)
    ok = decoded.replace("\r\n", "\n") == data.replace("\r\n", "\n")
    print(f"{name}: version {qr.version}, {qr.symbol_size(border=0)[0]} modules, ecc {qr.error.upper()}, decode {'OK' if ok else 'FAILED'}")
    if not ok:
        print("  got:", repr(decoded)); sys.exit(1)

make("qr-contact", VCARD)
make("qr-whatsapp", WHATSAPP)
