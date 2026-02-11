---
title: Interés compuesto en CETES
description: ¿Cómo funciona el interés compuesto cuando inviertes en CETES?
published_at: 2023-05-15
cover_path: img/posts/obligacion_a_declarar/cover.png
cover_alt: Alyx y Nina acostadas en el cesped disfrutando de la vida.
tags: ['cetes', 'interés compuesto', 'cetesdirecto']
themes: []
newsletter_cta: true
draft: true
---

<details open>
  <summary>
    Contenidos
  </summary>

  [[toc]]

</details>

{% from "embeddedPost.njk" import embedPost with context %}

Como dicen muchos, el interés compuesto es la octava maravilla del mundo, y es una de las mejores formas de hacer crecer tu dinero.

Pero, ¿cómo funciona ese interés compuesto en tus inversiones? Y más específicamente, **¿cómo funciona cuando hablamos de tus inversiones en CETES?**

***

Hace tiempo escribí sobre el interés compuesto en este otro post, así que tomaré una parte del mismo para explicar qué es el interés compuesto:

{{ embedPost('interes_compuesto') }}

## ¿Qué es el interés compuesto?

Es la generación de interés tomando en cuenta la inversión inicial, **más** los intereses que esa misma inversión genera.

> Es generar intereses de los intereses.

Por ejemplo, una inversión de $10,000 pesos a una tasa de 10% a un año. Empiezas con $10,000 pesos y en un año tienes $11,000; **ganas $1,000 pesos de interés**.

Si reinviertes los $10,000 iniciales más tu ganancia de $1,000 con las mismas características, 10% a un año, el siguiente año tienes $12,100. Una ganancia de $1,100 pesos. Y así sucesivamente.

Puedes calcular los rendimientos con interés compuesto para cualquier periodo de un chingazo, pa' no hacer tantas cuentas:

> Monto final = Monto inicial x ( 1 + r/100 )<sup>n</sup>

<math display="block">
  <mrow>
    <mtext>Monto final</mtext>
    <mo>=</mo>
    <mtext>Monto inicial</mtext>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mn>1</mn>
    <mo>+</mo>
    <mfrac linethickness="1">
      <mrow>
        <mtext>r</mtext>
      </mrow>
      <mrow>
        <mn>100</mn>
      </mrow>
    </mfrac>
  </mrow>
</math>

donde:
- r = tasa de interés
- n = número de periodos

Entonces, una inversión de $10,000 pesos a una tasa de 10% durante 30 años se calcula así:

> Monto final = 10,000 x ( 1 + 10/100 )<sup>30</sup> = $174,494

O si lo prefieres en formato de tabla:

| Año | Rendimientos (10%) | Total      |
|-----|--------------------|------------|
| 0   | 0                  | 10,000     |
| 1   | 1,000              | 11,000     |
| 2   | 1,100              | 12,100     |
| 3   | 1,210              | 13,310     |
| 4   | 1,331              | 14,641     |
| ... | ...                | ...        |
| 30  | 15,863             | 174,494    |

Empezando con $10,000 y reinvirtiendo las ganancias durante 30 años terminarías con $174,494 pesos 😱

Y ahora, ¿cómo funciona ese interés compuesto en CETES? 

PONER CALCULADORA DE CETES COMO EJEMPLO DE REINVERSI´ON Y SOLAMENTE LINKEAR AL OTRO POST SOBRE LOS RENDIMIENTOS DE CETES, PARA LOS CURIOSOS

## Rendimientos en 

Para empezar, recordemos que los CETES tienen un plazo y una tasa de interés fija **anualizada**. 

{% image 'img/posts/interes_compuesto_en_cetes/plazos_y_tasas_cetes.png', 'Plazos y tasas de CETES al día 27 de abril del 2023.' %}

Si ahorita comprara CETES a 12 meses, estos me pagarían un 11.77% de intereses al final de ese periodo. Si comprara CETES a 1 mes, y no configurara la reinversión automática, estos me pagarían un 1/12 del 11.27% de interés que ofrecen, es decir, un ~0.94% de intereses.