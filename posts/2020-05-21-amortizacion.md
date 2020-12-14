---
title: "Lo mínimo que debes saber sobre amortización 📉"
description: "Amortización es el pago gradual de una deuda o crédito mediante abonos periódicos. Cierto porcentaje de cada abono sirve para pagar los intereses de la deuda, mientras que otro porcentaje es para reducirla."
published: true
published_at: 2020-05-21
cover_path: /img/posts/covers/amortizacion.png
cover_alt: "Nina sentada sobre el pasto en el parque, con la lengua de fuera."
tags: ['creditos', 'deudas']
newsletter_cta: true
---

<details open>
  <summary>
    Contenidos
  </summary>

  [[toc]]

</details>

¿Amorti-qué? 🤨

Amortización me pareció una palabra muy críptica desde el primer momento que la escuché. Suena como Morticia: 

![Morticia, de Los Locos Adams](/img/posts/morticia.png)

Si vas a un diccionario encontrarás: El acto o proceso de amortizar. O sea, no salimos del mismo hoyo. 

Cuando sacas un crédito usualmente tienes que hacer una serie de pagos periódicos para poder liquidar la deuda; **eso se conoce como amortización**. Usualmente este concepto se utiliza en dos situaciones: en deudas y en temas contables para empresas. 

Aquí solo nos enfocamos en amortización cuando hablamos de deudas o créditos.

> Amortización es el pago gradual de una deuda o crédito mediante abonos periódicos. Cierto porcentaje de cada abono sirve para pagar los intereses, mientras que otro porcentaje es para reducir la deuda. 

Este tema me pareció interesante porque tuve una discusión con los del trabajo sobre deudas y salieron muchas preguntas que ninguno de nosotros pudo resolver por completo.

Una de las cuestiones principales era: Tengo un crédito, **¿me conviene que los abonos a capital reduzcan mis mensualidades o que reduzcan el tiempo del crédito?**

Para poder resolver esta duda, es necesario entender las famosas **tablas de amortización** que vienen acompañadas de la mayoría de los créditos bancarios. En este post hablaré de ellas.

Te enseñaré lo **mínimo** que debes saber sobre una tabla de amortización, y te **compartiré un archivo de Excel** con un ejemplo dinámico para que modifiques valores y puedas tomar mejores decisiones.

***

## Conceptos básicos

Lo primero que debes conocer son los conceptos o factores que interactúan en una tabla de amortización:

- 💵 **Principal**: Es la cantidad de dinero que te están prestando. En un crédito por 1 millón de pesos, esa misma cantidad es el principal. Sobre este monto se calculan los intereses por pagar.

- 💵 **Cantidad amortizada**: Es la cantidad de dinero que se va a tu deuda. Cierto porcentaje de tu pago mensual va directo al principal, esta es la cantidad amortizada. 

- 💵 **Tabla de amortización**: Es el calendario de pagos a realizar para liquidar tu crédito. Lo más común es que sea una tabla con las cantidades específicas a pagar cada mes, así como los intereses y cantidad amortizada de cada pago.

- 💵 **Tasa de interés**: No es diferente a una tasa de interés común y corriente. Usualmente se especifica como una tasa de interés **anualizada**.

- 💵 **Periodos**: Los momentos en que tienes que hacer los pagos. Periodos mensuales son lo más normal. También existen trimestrales, semestrales, anuales, etc.

- 💵 **Pagos fijos o mínimo**: Es la cantidad mínima a pagar en cada periodo. Un porcentaje del pago mínimo se usa para pagarle al acreedor (el banco), y otro porcentaje se usa para reducir tu deuda.

- 💵 **Abonos a capital**: Es cuando abonas más del mínimo a tu crédito para liquidarlo más rápido y ahorrarte lana en intereses. 

Uff, ya terminó la parte aburrida. Me sentí como haciendo una tarea de secundaria. 

No te preocupes si no recuerdas lo que acabas de leer, cuando lleguemos al archivo de Excel cada concepto hará sentido.

## Tips sobre créditos bancarios

También quiero mencionar algunos hechos/tips generales sobre los créditos bancarios:

-🏦 Los bancos son unos perros. Pero no **perros chingones como Perro Dinero** 🤙, sino unos perros cabrones. No te darán información que no les conviene a menos que preguntes, y preguntes, y preguntes. 

- 🏦 Es **buena idea pagar más del mínimo en cada periodo**. Ahorras dinero al largo plazo, y terminas de pagar más pronto.

- 🏦 Los bancos no te dirán que puedes hacer abonos a capital; tienes que preguntarlo e informarte tú. Algunos te querrán cobrar comisiones, o te pondrán trabas como "solo puedes abonar a capital durante los primeros dos días del mes". Intenta negociarlo.

- 🏦 Cuando haces un abono a capital, el banco te preguntará: ¿quieres reducir tu mensualidad o el tiempo del crédito? **No te dirán cuál es la mejor opción porque no les conviene**. Usualmente conviene reducir el tiempo en lugar de la mensualidad. **Usualmente**. Más adelante tú decidirás lo mejor para tu situación.

- 🏦 Busca opciones en varios bancos diferentes.

- 🏦 Al inicio de los créditos es común que la mayor parte de tu mensualidad se vaya a intereses. Esto quiere decir que le estás pagando al primero al banco y luego a tu deuda. Por eso los abonos a capital son, en general, una buena idea; pagas directamente a tu deuda. 

Con eso fuera del camino, vamos a comenzar con nuestro ejemplo. En esta tabla de amortización tomo en cuenta lo más esencial: pagos mensuales, porcentaje de tus pagos que se van a interés y principal y abonos a capital. 

Un crédito real es mucho más complejo porque puede incluir comisión por apertura, comisión anual, comisión por abonos a capital, refinanciamientos, tasas de interés variable, entre otras cosas.

Pero con lo que aprenderás en este ejemplo ya estarás **por delante de la mayoría de las personas**.

## Tabla de amortización

El [enlace al archivo lo puedes encontrar aquí](https://docs.google.com/spreadsheets/d/1o5SewkkvbCveAVtA5jLGXOdNjkd2L0-pyqyjgI80mdU/edit?usp=sharing), es un archivo de Google Drive.

La tabla de amortización se ve así (no importa si no alcanzas a distinguir nada):

![Tabla de amortización](/img/posts/tabla_amortizacion.png)

Tiene lo más básico de una tabla de amortización y también un par de funcionalidades para que puedas agregar abonos a capital y decidir, con granularidad mensual, si quieres que tus abonos reduzcan la mensualidad o el tiempo del crédito.

Ahora, ¿cómo la utilizas? Jugarás con estos valores:

![Variables a introducir en tabla de amortización](/img/posts/tabla_amortizacion_campos.png)

Aquí puedes modificar el total de tu crédito, la tasa de interés **anualizada**, la cantidad de pagos o meses del crédito, los abonos que planeas hacer a capital y la fecha de inicio. La mensualidad se calcula **automáticamente** con el resto de los campos.

El abono a capital que especifiques en esta parte es global. Eso quiere decir que aplica para todos los periodos. Si quieres modificar ciertos periodos individualmente solo escribe la cantidad en la casilla correspondiente al periodo. ¿Por qué harías esto? Por si quieres hacer pagos más grandes en ciertos meses. O si un mes no abonarás extra.

El archivo tiene también una serie de casillas para modificar si los abonos a capital reducen tu mensualidad o reducen el tiempo del crédito.

La primera casilla es esta:

![Abono a capital](/img/posts/abono_a_capital.png)

Cuando la seleccionas estás diciendo que todo abono a capital reduzca, cada mes, la mensualidad de tu crédito.

Cada fila tiene también una casilla para decidir si quieres que el abono de ese mes se vaya a reducción de mensualidad o tiempo:

![Checkbox para mantener mensualidad](/img/posts/checkbox_mensualidad.png)

¿Por qué dos tipos de casillas? Lo hice para que tuvieras un control más fino de tus pagos. Puede que primero quieras dedicarte a reducir la mensualidad por unos años para no estar con la soga en el cuello, y después de eso ya quieras que tus abonos a capital reduzcan el tiempo únicamente.

Puedes utilizar el archivo con lo que has aprendido hasta ahora, no necesitas modificar las fórmulas de la tabla en sí. Yo tuve que aprender a calcular cada una de las celdas para hacer este archivo para que tú no tuvieras que hacerlo 😉

Sin embargo, sí recomiendo que entiendas cómo se calcula cada celda. Es importante saber de dónde salen los números. Si aun así te da hueva, puedes irte a la siguiente sección.

## ¿De dónde salen los números?

Usaré los valores de la imagen de arriba para los ejemplos. 

- 📈 Crédito de $1,000,000 de pesos

- 📈 Tasa de interés anualizada del 10%

- 📈 180 pagos (pagos mensuales durante 15 años)

- 📈 Sin abonos a capital

### La mensualidad

El primer dato que calculé cuando creé esta tabla de amortización fue el pago fijo o mensualidad. Excel tiene una función que se llama PMT (en inglés). Esta función te permite calcular justo lo que queremos, un pago fijo basado en un número de periodos y una tasa de interés fija. Se usa así:

`PMT( tasa de interés, número de periodos o meses, total de deuda )`

La función inicia con un signo negativo para que la cantidad resultante sea positiva. Es común hacer esto porque en términos contables pagar algo es una salida de dinero, por lo que es natural que tenga el signo negativo. Nosotros lo queremos positivo.

El otro detalle es que la tasa de interés que definimos en el archivo es **anualizada**, pero **nuestros pagos son mensuales**. Entonces tenemos que dividir la tasa de interés entre 12 (los meses del año).

Con el ejemplo del millón:

`PMT( 10% / 12, 180, 1000000) = $10,746.05`

**Y ese es la mensualidad de nuestro crédito**.

### Pago total del mes

Esta celda es la suma de la mensualidad y el pago extra, suponiendo que haces uno (psst, hazlo).

### Intereses

Es la **tasa de interés** dividida entre el **número de pagos al año** multiplicada por el **balance o saldo del mes anterior** (la cantidad antes del pago del mes para el que estás calculando el interés). 

Recuerda que en nuestros ejemplos la tasa de interés es anualizada y los pagos son mensuales. Entonces:

`Intereses = tasa de interés / 12 * saldo del mes anterior`

Ejemplo para el primer periodo:

`Intereses = 10% / 12 * 1000000 = $8,333.33`

Recuerda que 10% es igual a 0.1. Excel se encarga de esa magia, pero por si haces estos cálculos en otro lugar 😉

### Amortización

Es el valor de la mensualidad menos los intereses:

`Amortización = mensualidad - intereses`

Aquí no estamos incluyendo los abonos a capital porque los incluiremos en el balance de cada mes directamente. Ejemplo para el primer periodo:

`Amortización = 10746.05 - 8333.33 = $2,412.72`

### Balance a fin de mes

Esta es la cantidad que deberás después de haber hecho el pago del mes en curso. Se calcula como el balance actual menos la amortización menos el abono a capital.

`Balance a fin de mes = balance actual - amortizacion - abono a capital`

Ejemplo para el primer periodo:

`Balance a fin de mes = 1000000 - 2412.72 - 0 = $997,587.28`

Esos son los campos importantes de los que quería hablar. El resto de los valores son principalmente sumas intuitivas como el total a pagar por tu crédito (dinero prestado + intereses).

Ahora, ¡a los ejemplos!

## Ejercicios

Vamos viendo qué pasa cuando jugamos con los factores del crédito. Vamos a trabajar con los siguientes supuestos:

- 🏦 Préstamo por $1,000,000 de pesos.

- 🏦 Tasa de interés del 10%

- 🏦 180 pagos (15 años)

Esos serán nuestros valores base. Con esto, vamos a comparar lo que pagamos en realidad cuando:

- 🏦 Solo pagamos el mínimo.

- 🏦 Abonamos a capital y reducimos tiempo.

- 🏦 Abonamos a capital y reducimos mensualidad.

### Solo pagando el mínimo

![Variables para el ejercicio de amortización](/img/posts/variables_ejercicio.png)

En 180 meses terminamos de pagar el melón que debíamos. Pero también pagamos $934,289 pesos en intereses 😱 **Es casi el doble el préstamo inicial** 🤯.

Y toma en cuenta que justo esta situación es una de las más comunes entre las personas que tienen un crédito. Peor aún, [según Banxico, con datos a febrero del 2018](https://www.banxico.org.mx/publicaciones-y-prensa/rib-creditos-personales/%7B640FF0D2-8C72-2800-B9DB-E6899A3F1DC2%7D.pdf), los créditos personales son el segundo tipo de crédito con más morosos (15.2%). Y por si tenías curiosidad, el primer lugar es del 16.3% y es de deudas a tarjetas de crédito.

Pequeño paréntesis; moroso me parece una palabra muy cómica, no sé por qué. Moroso es alguien que se retrasa en el pago de una deuda.

### Con abonos a capital, reduciendo mensualidad

Vamos a suponer que pagas $1,000 pesos **extras** cada mes, es decir, tu mensualidad + $1,000. Ese dinero se abonará directamente al capital. Y cuando el banco te pregunte, ¿reduces mensualidad o tiempo? **Dirás mensualidad**:

![Resultado de ejercicio con abono a capital, reduciendo mensualidad](/img/posts/abono_reduciendo_mensualidad.png)

La diferencia al ejemplo anterior es que ahora pudiste ahorrar un poco de lana y aventarla al crédito para adelantarle. Terminaste de pagar el melón que te prestaron, y ahora pagaste $855,512 de interés. **Eso es aproximadamente $78,000 pesos menos que sin abonos**.

**Esa diferencia fue solo por pagar $1,000 pesos extra cada mes**.

Y eso no es todo, también terminaste un mes antes, en 179 en lugar de 180. **Peor es nada** 🤷🏻‍♂️

Recuerda que cada abono a capital se utilizó para reducir la mensualidad, por lo que no pagas los $10,746.05 como en el primer ejemplo, sino que se reduce un poco cada mes, por los $1,000 extras que estuviste abonando. En el séptimo año de tu crédito estarías pagando una mensualidad de $9,712.51:

![Resultados en el séptimo año](/img/posts/resultados_septimo_ano.png)

Entonces, en teoría, cada mes que pasa es más fácil seguir pagando tu crédito pues tu mensualidad se reduce.

### Con abonos a capital, reduciendo el tiempo

Mismo crédito, mismo pago extra a capital, pagando la misma mensualidad todos los meses, los $10,746.05 pesos:

![Resultados con abono a capital, reduciendo el tiempo](/img/posts/abono_reduciendo_tiempo.png)

$749,437 pesos de intereses en total. **Más de $100,000 de diferencia entre el ejemplo anterior**, y mucho más que el primer ejemplo sin ninguna aportación extra. Y lo **terminas de pagar en 149 meses, o 12 años y cuatro meses**, en lugar de 15.

### Comparación

Aquí una tabla con los resultados de cada ejercicio, para ver la imagen completa:

![Comparación de resultados](/img/posts/ejercicio_comparacion.png)

Con esta información que acabamos de descubrir, quizá piensas, "okay, entonces la forma de ahorrarme más dinero y salir antes de deudas es abonando a capital y reduciendo el tiempo del crédito". Técnicamente, sí, pero **decidir solo con esta información no es una solución práctica**.

## ¿Qué es mejor entonces?

Las malas noticias. Es imposible que yo te pueda decir qué es lo mejor para ti. Hay demasiados factores que no estoy tomando en consideración en estos ejemplos. No porque no quiera, **sino porque no puedo**. 

Cada uno de nosotros tiene su contexto, sus problemas, sus necesidades. Todos tenemos diferentes responsabilidades. No puedo sugerirte que vayas y abones a capital el 15% de tus ingresos cada mes para pagar tus deudas más rápido. 

Lo que si te digo es que con esta tabla de amortización tienes **una herramienta más para poder tomar la mejor decisión** de acuerdo a tu contexto.

**¿Tienes más deudas?** Crea dos tablas de amortización y juega con los valores en cada una. 

**¿Tienes gastos previstos dentro de unos meses?** Reduce tu abono a capital para que no te las veas negras, y luego intenta volver a incrementarlo.

**¿No ves manera de ahorrar un poco de lana al mes para pagar extra?** Usa parte de tus ingresos irregulares para abonar a capital. Con ingresos irregulares me refiero a cosas como aguinaldo, retorno de impuestos, bonos, etc. 

**¿Estás muy motivada ahorrarte dinero y quieres aportar más?** Busca la forma de incrementar tus ingresos. Puede ser con un ascenso en el trabajo, vender cosas que no usas, etc. 

Podría seguir con más situaciones, pero no es el punto. Lo que quiero que entiendas es que tienes aquí una herramienta cuyo único propósito es ayudarte a salir de tus deudas lo antes posible. Úsala.

## Recomendaciones generales

Eso si, hay cosas que aplican a casi todos los créditos:

- 💡 Si puedes abonar a capital, hazlo. Entre más puedas, mejor.

- 💡 Intenta negociar una reducción de la tasa de interés después de unos años.

- 💡 Juega con diferentes combinaciones de abonos a capital.
  
***
  
Este fue un post denso. Espero que la tabla de amortización que creé te sirva para ahorrarte un buen varo y salir de tus deudas más rápido. 

Modifica la tabla y prueba distintas combinaciones de aportaciones a capital. Prueba reduciendo la mensualidad unos meses y luego a reducir el tiempo. Luego al revés.

Diseña el plan que mejor se acomoda a tu contexto, y apégate a él 👊🏼

**Muchas gracias por leerme hasta el final y mantenerte conmigo en este tema tan complejo ❤️**