---
title: "Rendimientos de una inversión en CETES: Ejemplo práctico"
description: Aprende a calcular el interés bruto, neto y ganancia real de una inversión en CETES con un ejemplo paso a paso.
published_at: 2023-05-08
cover_path: img/posts/rendimientos_en_cetes/cover.png
cover_alt: Nina tirando la hueva en el piso.
tags: ['cetes', 'interés compuesto', 'cetesdirecto', 'isr', 'inversion']
themes: ['inversion']
newsletter_cta: true
---

<details open>
  <summary>
    Contenidos
  </summary>

  [[toc]]

</details>

Así están las opciones de inversión en CETES de Cetesdirecto al 29 de abril del 2023:

{% image 'img/posts/rendimientos_en_cetes/rendimientos_cetes_abril_2023.png', 'Las tasas y plazos corresponden a la tasa indicativa de referencia consultada el 29 de abril del 2023.' %}

Y lo que más nos interesa saber es **cuánto dinero tendremos al final de nuestra inversión.** Podemos utilizar la [calculadora de rendimientos de Cetesdirecto](https://www.cetesdirecto.com/calculadoras/cetes?method=init) para conocer los números exactos de nuestra inversión.

Pero para los curiosos, como yo, también podemos aprender de dónde salen esos números. De eso trata este post.  

***

## Características de la inversión

Para comenzar, necesitamos conocer tres cosas:
- 💰 Monto de inversión.
- 📅 Plazo del CETE.
- 📈 Tasa de interés.

Tomemos como ejemplo una inversión de $10,000 pesos en CETES a 28 días, con una tasa de interés del 11.27%. 

Empecemos por calcular el interés bruto.

## Interes bruto

El interés bruto es la cantidad ganada <span class="annotated">antes de restar los impuestos.<span>

Para obtener este número, primero calculamos el monto total de la inversión, que no es mas que una multiplicación de los tres factores que mencionamos al principio:

<math>
  <mrow>
    <mi>Monto de inversión</mi>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mi>Plazo en días</mi>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mi>Tasa de interés</mi>
  </mrow>
</math>

Haciendo la sustitución:

<math>
  <mrow>
    <mtext>$</mtext>
    <mn>10,000</mn>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mn>28</mn>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mrow>
      <mn>11.27</mn>
      <mo>%</mo>
    </mrow>
    <mo>=</mo>
    <mtext>$</mtext>
    <mn>31,556</mn>
  </mrow>
</math>

No olvides que la **tasa de interés es un porcentaje** y al momento de hacer operaciones tienes que dividirlo entre 100. O sea:

<math>
  <mrow>
    <mtext>$</mtext>
    <mn>10,000</mn>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mn>28</mn>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mrow>
      <mn>0.1127</mn>
    </mrow>
    <mo>=</mo>
    <mtext>$</mtext>
    <mn>31,556</mn>
  </mrow>
</math>

También recuerda que la tasa de interés es **anualizada**; no obtendrás el 11.27% de rendimiento en un plazo de 28 días, sino lo propocional al año completo. Por ello, tenemos que dividir el resultado entre el [número de días del año financiero o año comercial (360 días)](https://es.wikipedia.org/wiki/A%C3%B1o_comercial):

<math display="block">
  <mrow>
    <mfrac linethickness="1">
      <mrow>
        <mtext>$</mtext>
        <mn>31,556</mn>
      </mrow>
      <mrow>
        <mn>360</mn>
      </mrow>
    </mfrac>
    <mo>=</mo>
    <mtext>$</mtext>
    <mn>87.66</mn>
  </mrow>
</math>

Esa es la cantidad **aproximada** de intereses brutos que ganarás en tu inversión de $10,000 pesos en CETES a 28 días. Y digo aproximada porque diferirá por unos pocos centavos. Eso lo revisaremos al final de este ejemplo.

## Impuesto Sobre la Renta (ISR)

Y por supuesto, hay que pagar impuestos por nuestras inversiones, en este caso, el ISR.

Para calcularlo, necesitamos conocer la tasa de ISR sobre inversiones para el año en que hacemos la inversión. Esta tasa cambia cada año, y para las inversiones hechas en el 2023, esa <span class="annotated">tasa es del 0.15%</span>. Puedes [consultar este dato en la Ley de Ingresos de la Federación para el ejercicio fiscal 2023](https://www.diputados.gob.mx/LeyesBiblio/pdf/LIF_2023.pdf), página 33, artículo 21.

Ahora, al cálculo:

<math>
  <mrow>
    <mi>Monto de inversión</mi>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mi>ISR</mi>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mi>Plazo en días</mi>
  </mrow>
</math>

<math>
  <mrow>
    <mtext>$</mtext>
    <mn>10,000</mn>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>
    <mrow>
      <mn>0.15</mn>
      <mo>%</mo>
    </mrow>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">&#x00D7;</mo>    
    <mn>28</mn>
    <mo>=</mo>
    <mtext>$</mtext>
    <mn>420</mn>
  </mrow>
</math>

Dividimos esta cantidad entre los [días naturales que tiene el año (365 o 366 en años bisiestos)](https://es.wikipedia.org/wiki/A%C3%B1o_natural):

<math display="block">
  <mrow>
    <mfrac linethickness="1">
      <mrow>
        <mtext>$</mtext>
        <mn>420</mn>
      </mrow>
      <mrow>
        <mn>365</mn>
      </mrow>
    </mfrac>
    <mo>=</mo>
    <mtext>$</mtext>
    <mn>1.15</mn>
  </mrow>
</math>

Y esta cantidad corresponde al ISR a pagar por tu inversión de $10,000 pesos.

## Interés Neto

Este es el número que importa, pues es lo que te toca después de considerar el pago de impuestos.

Para calcularlo, restamos el ISR del interés bruto que obtuvimos anteriormente:

<math>
  <mrow>
    <mi>Interés bruto</mi>
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">-</mo>
    <mi>ISR</mi>
    <mo>=</mo>
    <mi>Interés neto</mi>
  </mrow>
</math>

Sustituyendo:

<math>
  <mrow>
    <mrow>
      <mtext>$</mtext>
      <mn>87.66</mn>
    </mrow> 
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">-</mo>
    <mrow>
      <mtext>$</mtext>
      <mn>1.15</mn>
    </mrow> 
    <mo>=</mo>
    <mrow>
      <mtext>$</mtext>
      <mn>86.51</mn>
    </mrow>
  </mrow>
</math>

## Ganancia

Por último, tu ganancia es la suma del capital que invertiste inicialmente y el interés neto, o sea:

<math>
  <mrow>
    <mrow>
      <mtext>$</mtext>
      <mn>10,000</mn>
    </mrow> 
    <mo class="font-bold text-accent-500 dark:text-accent-dark-500">+</mo>
    <mrow>
      <mtext>$</mtext>
      <mn>86.51</mn>
    </mrow> 
    <mo>=</mo>
    <mrow>
      <mn><span class="annotated">$10,086.51</span></mn>
    </mrow>
  </mrow>
</math>

## Remanentes

Todos estos cálculos son aproximados y serán diferentes de los montos finales, pero **solo por unos centavos**.

¿Por qué? 

Porque recuerda que al invertir en CETES estás comprando títulos de deuda, y cada uno de estos títulos tiene un precio. Los CETES **los compras a descuento**; aunque su valor nominal es de $10 pesos, tú los compras por algunos centavos menos. 

Si los compraras al valor nominal de $10 pesos, podrías comprar exactamente 1,000 títulos de CETES con los $10,000 pesos de tu inversión. 

Pero como los compras más baratos, a descuento, te alcanza para unos cuantos más y en ocasiones te queda un **remanente de dinero que no es suficiente para comprar otro título**, entonces en automático se invierte en el fondo de liquidez diaria de Cetesdirecto, Bonddia.

Esto lo puedes ver claramente en la calculadora de Cetesdirecto que compartí al principio:

{% image 'img/posts/rendimientos_en_cetes/calculadora_cetes_28_dias.png', 'Cálculo de rendimientos usando la calculadora de Cetesdirecto.' %}

Los intereses e ISR de la inversión remanente en Bonddia es la diferencia en centavos que vimos en este ejercicio.

Espero que con este ejemplo te haya quedado más claro cómo se calculan los intereses de una inversión en Cetes. Este mismo ejercicio lo puedes hacer para cualquier otro plazo y/o tasa.

Muchas gracias por leerme 💜.