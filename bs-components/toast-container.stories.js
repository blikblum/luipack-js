import './toast-container.js'

export default {
  title: 'Components/ToastContainer',
  component: 'toast-container',
  args: {
    contentClass: 'p-3',
  },
  argTypes: {
    position: {
      options: ['top-left', 'top-center', 'top-right'],
      control: { type: 'radio' },
    },
  },
}

const defaultToasts = [{ message: 'Operation successful' }]

const errorToasts = [{ type: 'error', message: 'Operation failed' }]

const warningToasts = [{ type: 'warning', message: 'Operation successful but with warning' }]

const customTitleToasts = [{ title: 'Great', message: 'Operation successful' }]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const Default = {
  args: {
    toasts: defaultToasts,
  },
}

export const ErrorType = {
  ...Default,
  args: {
    toasts: errorToasts,
  },
}

export const Warning = {
  ...Default,
  args: {
    toasts: warningToasts,
  },
}

export const CustomTitle = {
  ...Default,
  args: {
    toasts: customTitleToasts,
  },
}

export const NoAutoHide = {
  ...Default,
  args: {
    toasts: defaultToasts.map((t) => ({ ...t, autohide: false })),
  },
}

export const Many = {
  ...Default,
  args: {
    toasts: [...customTitleToasts, ...defaultToasts],
  },
  async play({ canvasElement }) {
    const component = canvasElement.querySelector('toast-container')

    await sleep(1000)
    component.add(errorToasts[0])

    await sleep(2000)
    component.add(warningToasts[0])
  },
}
