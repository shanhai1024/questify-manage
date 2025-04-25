/** 给 html 加临时过渡 class，duration 默认 400ms */
export function withThemeTransition (duration = 400) {
    const html = document.documentElement
    html.classList.add('theme-transition')
    setTimeout(() => html.classList.remove('theme-transition'), duration)
}
/** 圆形波纹动画切换暗 / 亮
 *  btn   触发元素 (获取点击坐标)
 *  toDark true=切暗色, false=切亮色
 */
export function rippleTheme (btn: HTMLElement, toDark: boolean) {
    const { clientWidth, clientHeight } = document.documentElement
    const rect = btn.getBoundingClientRect()
    const x = rect.left + rect.width / 2   // 点击中心
    const y = rect.top + rect.height / 2

    // 创建覆盖层
    const overlay = document.createElement('div')
    overlay.style.position = 'fixed'
    overlay.style.left = '0'
    overlay.style.top = '0'
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.pointerEvents = 'none'
    overlay.style.zIndex = '9999'
    overlay.style.background = toDark ? '#141414' : '#ffffff'

    // 初始 clip-path 为半径 0 的圆
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`
    overlay.style.transition = 'clip-path .6s ease-out'

    document.body.appendChild(overlay)

    // 触发浏览器重绘，然后放大圆到能覆盖整屏
    requestAnimationFrame(() => {
        const finalR = Math.hypot(
            Math.max(x, clientWidth - x),
            Math.max(y, clientHeight - y)
        )
        overlay.style.clipPath = `circle(${finalR}px at ${x}px ${y}px)`
    })

    // 动画结束后真正切换主题 & 移除覆盖层
    overlay.addEventListener(
        'transitionend',
        () => {
            document.documentElement.classList.toggle('dark', toDark)
            overlay.remove()
        },
        { once: true }
    )
}
