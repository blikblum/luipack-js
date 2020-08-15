import { view, state } from 'nextbone'
import { form } from 'nextbone/form'
import { Component, html, property } from '../light-component'

@form({
  inputs: {
    'array-input': ['change'],
    '[form-input]': ['change'],
  },
})
@view
class ModalForm extends Component {
  @property({ type: String })
  title

  @state({ copy: true })
  model

  connectedCallback() {
    super.connectedCallback()
    if (this.data) {
      for (const prop in this.data) {
        this.form.setData(prop, this.data[prop])
      }
    }
  }

  saveClick() {
    if (this.form.isValid({ update: true, touch: true })) {
      this.trigger('submit', this.model)
    }
  }

  render() {
    return html`
      <div class="modal-header">
        <h3 class="modal-title">${this.title}</h3>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body bg-secondary">
        <form>
          ${this.formRender(this.form)}
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          Fechar
        </button>
        <button type="button" class="btn btn-primary" @click=${this.saveClick}>
          Salvar
        </button>
      </div>
    `
  }
}

customElements.define('modal-form', ModalForm)

export { ModalForm }
