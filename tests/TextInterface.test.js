import { mount } from '@vue/test-utils'
import { text, lines, linesInsertY } from './TextInterfaceDataResults.js'
import TextInterface from '../src/components/TextInterface.vue'

describe('TextInterface', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(TextInterface, {
      props: {
        fullText: 'lorem ipsum\nagain'
      }
    })
  })
  describe('Initialization', () => {
    test('mount component', async () => {
      expect(TextInterface).toBeTruthy()
    })

    test('calculate text', async () => {
      expect(TextInterface).toBeTruthy()
      expect(wrapper.vm.text).toStrictEqual(text)
    })

    test('init lines', async () => {
      await wrapper.vm.$nextTick()
      expect(await wrapper.vm.initLines()).toStrictEqual(lines)
    })
  })
  describe('User interactions', async () => {
    beforeEach(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
    })
    test('select cursor position', async () => {
      wrapper.vm.selectCursorPosition({ id: 2, char: 'r', comment: undefined })
      expect(wrapper.vm.currentCursorPosition).toStrictEqual({ id: 2, char: 'r' })
    })

    test('handle Write', async () => {
      wrapper.vm.selectCursorPosition({ id: 2, char: 'r', comment: undefined })
      await wrapper.find('#main-interface').trigger('keydown', {
        key: 'y'
      })
      await new Promise((resolve) => setTimeout(resolve, 300))
      expect(wrapper.vm.lines).toStrictEqual(linesInsertY)
    })
  })
})
