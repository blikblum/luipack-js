import { Component, html, property, ref, repeat } from '../light-component.js'
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

export class ToastContainer extends Component {
  @property({ attribute: false })
  toasts = []

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
        element.addEventListener('hidden.bs.toast', () => {
          this.toasts = this.toasts.filter((item) => item !== toast)
        })
      }
    }
  }

  render() {
    return html`
      <div class="toast-container">
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
