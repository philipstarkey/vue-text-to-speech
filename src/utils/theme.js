export function writeThemeSelector() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function setTheme(theme) {
  if (["light", "dark"].includes(theme)) {
    localStorage.theme = theme;
  } else if (theme == null) {
    localStorage.removeItem('theme')
  }
}
