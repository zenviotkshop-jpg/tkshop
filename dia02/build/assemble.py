css=open('_style.css').read().replace('</style>','.dot{display:block;width:22px;height:22px;border-radius:50%;background:#b9b0d8}\n</style>')
html='<!doctype html>\n<html lang="es"><head><meta charset="utf-8">\n'+css+'</head><body>\n'+open('_body.html').read()+'\n<script src="data.js"></script>\n<script>\n'+open('_helpers.js').read()+'\n'+open('_render.js').read()+'\n</script></body></html>'
open('index.html','w').write(html)
