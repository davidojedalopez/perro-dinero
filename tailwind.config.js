module.exports = {
  darkMode: 'class',
  purge: ['./_site/**/*.html', './**/*.njk'],
  theme: {    
    extend: {      
      colors: {      
        primary: '#000000',
        accent: {
            100: '#E8F3EB',
            200: '#C7E1CE',
            300: '#A5CEB1',
            400: '#61AA76',
            500: '#1D853B',
            600: '#1A7835',
            700: '#115023',
            800: '#0D3C1B',
            900: '#092812',
        },
        'accent-dark': {
            100: '#FEFAEC',
            200: '#FCF2CF',
            300: '#FAEAB2',
            400: '#F7DA78',
            500: '#F3CA3E',
            600: '#DBB638',
            700: '#927925',
            800: '#6D5B1C',
            900: '#493D13',
        },
        background: '#FAFAFA',
        'background-dark': '#222831',
        'foreground-dark': '#393e46',
        'primary-dark': '#EEEEEE',
        'twitter': '#1b95e0',
        'twitter-hover': '#0c7abf'
      },
      fontFamily: {
        'logo': ['Roboto Condensed', 'sans-serif'],
        'main': ['Open Sans', 'sans-serif']
      },
      zIndex: {
        '-1': '-1'
      }
    } 
  },
  plugins: []  
}
