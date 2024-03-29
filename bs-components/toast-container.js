import { Component, html, ref, repeat } from '../light-component.js'
import Toast from 'bootstrap/js/dist/toast.js'

function getTitleForType(type) {
  switch (type) {
    case 'error':
      return 'Error'
    case 'warning':
      return 'Warning'
    default:
      return 'Message'
  }
}

function getConfigForType(type) {
  switch (type) {
    case 'error':
      return { delay: 30000 }
    case 'warning':
      return { delay: 10000 }
    default:
      return {}
  }
}

const positionClassMap = {
  'top-left': 'top-0 start-0',
  'top-center': 'top-0 start-50 translate-middle-x',
  'top-right': 'top-0 end-0',
}

export class ToastContainer extends Component {
  static properties = {
    position: { type: String },
    contentClass: { attribute: 'content-class' },
    toasts: { attribute: false },
  }

  constructor() {
    super()
    this.toasts = []
  }

  add(toast) {
    this.toasts = [...this.toasts, toast]
  }

  toastChanged(element, toast) {
    if (element) {
      const config = { ...Toast.Default, ...getConfigForType(toast.type), ...toast }
      let instance = Toast.getInstance(element)
      if (!instance) {
        instance = new Toast(element, config)
        instance.show()
        element.addEventListener(
          'hidden.bs.toast',
          () => {
            this.toasts = this.toasts.filter((item) => item !== toast)
          },
          { once: true }
        )
      }
    }
  }

  render() {
    const { position, contentClass = '' } = this
    return html`
      <div class="toast-container ${positionClassMap[position] || ''} ${contentClass}">
        ${repeat(
          this.toasts,
          (toast) => toast,
          (toast) => {
            const { type = 'info', title = getTitleForType(type), message } = toast
            return html`
              <div
                class="toast"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                ${ref((el) => this.toastChanged(el, toast))}
              >
                <div class="toast-header">
                  <strong class="me-auto">${title}</strong>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="toast-body">${message}</div>
              </div>
            `
          }
        )}
      </div>
    `
  }
}

customElements.define('toast-container', ToastContainer)
