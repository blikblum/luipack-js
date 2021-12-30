import { render } from 'lit'

const components = new WeakSet()

class TabShowEvent extends Event {
  constructor(el) {
    super('tab-show', { bubbles: true })
    this.paneTarget = el
  }
}

class TabHideEvent extends Event {
  constructor(el) {
    super('tab-hide', { bubbles: true })
    this.paneTarget = el
  }
}

const findTabsOutlet = (tabs) => {
  let outlet = tabs.nextElementSibling
  if (outlet) {
    if (!outlet.matches('tabs-outlet') && !outlet.matches('.tab-content')) {
      outlet = outlet.querySelector('tabs-outlet') || outlet.querySelector('.tab-content')
    }
  }
  return outlet
}

export default class LiveTabs extends HTMLElement {
  constructor() {
    super()
    this.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link')) {
        e.preventDefault()
        this.updateTab(e.target)
      }
    })
  }

  updateTab(tab) {
    // todo update aria-selected
    if (this.activeTab) {
      this.activeTab.classList.remove('active')
    }

    const { activeTabContent } = this
    if (activeTabContent) {
      activeTabContent.classList.remove('active', 'show')
      if (components.has(activeTabContent) && activeTabContent.parentNode === this.outlet) {
        const hideEvent = new TabHideEvent(activeTabContent)
        this.activeTab.dispatchEvent(hideEvent)
        this.outlet.removeChild(activeTabContent)
      }
    }

    this.activeTab = tab

    let tabContent
    if (tab) {
      tab.classList.add('active')
      const contentId = tab.getAttribute('href') || tab.dataset.target
      if (this.outlet) {
        if (contentId) {
          tabContent = this.outlet.querySelector(contentId)
        } else {
          const component = tab.getAttribute('component')
          if (component) {
            tabContent = document.createElement(component)
            components.add(tabContent)
            const showEvent = new TabShowEvent(tabContent)
            tab.dispatchEvent(showEvent)
            this.outlet.appendChild(tabContent)
          } else {
            const tabRender = tab.render
            if (tabRender) {
              tabContent = document.createElement('div')
              components.add(tabContent)
              render(tabRender(tab), tabContent)
              const showEvent = new TabShowEvent(tabContent)
              tab.dispatchEvent(showEvent)
              this.outlet.appendChild(tabContent)
            }
          }
        }
      }
    }

    this.activeTabContent = tabContent
    if (tabContent) {
      tabContent.classList.add('active', 'show')
    }
  }

  connectedCallback() {
    const outlet = findTabsOutlet(this)
    if (!outlet) {
      console.warn(
        'live-tabs: tab content element not found. Expected "tabs-outlet" or ".tab-content" in sibling element'
      )
    }
    this.outlet = outlet
    const tabs = this.querySelectorAll('.nav-link')
    const activeTab = Array.prototype.find.call(tabs, (tab) => tab.classList.contains('active'))
    this.updateTab(activeTab)
  }

  disconnectedCallback() {}
}

customElements.define('live-tabs', LiveTabs)
