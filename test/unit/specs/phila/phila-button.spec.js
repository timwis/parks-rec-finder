import { mount } from 'avoriaz'
import PhilaButton from '@/components/phila/phila-button'
let PhilaButtonComponent

describe('PHILA::Button: phila/phila-button.vue', () => {
    beforeEach(() => {
        PhilaButtonComponent = mount(PhilaButton)
    })
    it('should render an child div with class "valign"', () => {
        let valignEl = PhilaButtonComponent.find('.valign')
        expect(valignEl.length).to.equal(1)
    })
    it('should render an grandchild div with class "button-label"', () => {
        expect(PhilaButtonComponent.contains('.button-label')).to.equal(true)
    })
    it('should render a button element when href prop IS NOT set', () => {
        expect(PhilaButtonComponent.is('button')).to.equal(true)
    })
    it('should render an anchor element when when href prop IS set', () => {
        let PhilaButtonComponent_a = mount(PhilaButton, {propsData:{'href': 'http://google.com'}})
        expect(PhilaButtonComponent_a.is('a')).to.equal(true)
        PhilaButtonComponent_a.destroy
    })
    xit('should render passed content in default slot', () => {
        // @TODO: test that default slot is renderd
        // let PhilaButtonComponent_wSlot = mount(PhilaButton, {
        //     slots:{
        //         default: '<i class="fa fa-search" aria-hidden="true"></i>'
        //     }
        // })
        // expect(PhilaButtonComponent_wSlot.contains('.fa-search')).to.euqal(true)
    })
    describe('METHODS:', () => {
        xit('')
        describe('onClick', () => {
            it('should emit a "click" event on user click', async () => {
                let ClickSpy = sinon.spy()
                PhilaButtonComponent.vm.$on('click',ClickSpy)
                PhilaButtonComponent.trigger('click')
                await PhilaButtonComponent.vm.$nextTick()
                ClickSpy.should.have.been.called
            })
            xit('should NOT emit a "click" event if disabled prop is set', async () => {
                // @TODO: figure out how to test disabled state
                const PhilaButtonComponent_disabled = mount(PhilaButton, {propsData: {disabled: true}})
                let DisabledSpy = sinon.spy()
                PhilaButtonComponent_disabled.vm.$on('click',DisabledSpy)
                PhilaButtonComponent_disabled.trigger('click')
                await PhilaButtonComponent_disabled.vm.$nextTick()
                DisabledSpy.should.not.have.been.called
                // expect(PhilaButtonComponent_disabled.hasClass('button--disabled')).to.equal(true)
            })
        })
    })
    afterEach(() => {
        PhilaButtonComponent.destroy()
    })
})
