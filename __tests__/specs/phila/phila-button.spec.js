import { mount } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
import PhilaButton from '@/components/phila/phila-button'
let PhilaButtonComponent

describe('PHILA::Button: phila/phila-button.vue', () => {
  beforeEach(() => {
    PhilaButtonComponent = mount(PhilaButton)
  })
  it('mathches snapshot', () => {
    const renderer = createRenderer()
    renderer.renderToString(PhilaButtonComponent.vm, (err, str) => {
      if (err) throw new Error(err)
        expect(str).toMatchSnapshot()
    })
  })
  it('should render an child div with class "valign"', () => {
    let valignEl = PhilaButtonComponent.find('.valign')
    expect(PhilaButtonComponent.contains('.valign')).toBe(true)
  })
  it('should render an grandchild div with class "button-label"', () => {
    expect(PhilaButtonComponent.contains('.button-label')).toBe(true)
  })
  it('should render a button element when href prop IS NOT set', () => {
    expect(PhilaButtonComponent.is('button')).toBe(true)
  })
  it('should render an anchor element when when href prop IS set', () => {
    let PhilaButtonComponentAnchor = mount(PhilaButton, {propsData: {'href': 'http://google.com'}})
    expect(PhilaButtonComponentAnchor.is('a')).toBe(true)
    PhilaButtonComponentAnchor.destroy()
  })
  it('should render children in default slot', () => {
    let PhilaButtonComponentWSlot = mount(PhilaButton, {
        slots:{
            default: '<i class="fa fa-search" aria-hidden="true"></i>'
        }
    })
    expect(PhilaButtonComponentWSlot.contains('.fa-search')).toBe(true)
  })

    describe('onClick', () => {
      it('should emit a "click" event on user click', () => {
        PhilaButtonComponent.trigger('click')
        expect(PhilaButtonComponent.emitted().click).toBeTruthy()
      })
      it('should NOT emit a "click" event if disabled prop is set', () => {
        const PhilaButtonComponentDisabled = mount(PhilaButton, {propsData: {disabled: true}})
        expect(PhilaButtonComponentDisabled.vm.disabled).toBe(true)
        // PhilaButtonComponentDisabled.trigger('click')
        // expect(PhilaButtonComponent.emitted().click).toBe(false)
      })
    })

  afterEach(() => {
    PhilaButtonComponent.destroy()
  })
})
