(() => {

    let yOffset = 0; // widow.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는 ) 씬(scroll-section)
    let enterNewScene = false; // 새로운 씬이 시작되는 순간 true

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messegeA: document.querySelector('#scroll-section-0 .main-message.a'),
                messegeB: document.querySelector('#scroll-section-0 .main-message.b'),
                messegeC: document.querySelector('#scroll-section-0 .main-message.c'),
                messegeD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messegeA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                // messegeB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messegeA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],

                messegeA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messegeA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
            }
        },
        {   // 1
            type: 'normal',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {   // 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {   // 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight; /* window(전역객체)는 따로 작성하지 않아도 됨 */
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`; /* 숨겨진 영역에 대한 높이 설정 템플릿 기호를 사용(괄호 안에는 변수명을 기입 가능) */
        }

        yOffset = window.pageYOffset;
        let totalscrollHeight = 0; // 해당 코드는 새로고침을 했을 때 totalscrollHeight와 pageYOffset을 비교하여 currentScene을 비교하여 값을 할당
        for (let i = 0; i < sceneInfo.length; i++) {
            totalscrollHeight += sceneInfo[i].scrollHeight;
            if (totalscrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) { // 인자 values는 sceneInfo의 values내의 0,1의 값을 의미
        let rv;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
            rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = (yOffset - prevScrollHeight) / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                const messegeA_opacity_in = calcValues(values.messegeA_opacity_in, currentYOffset);
                const messegeA_opacity_out = calcValues(values.messegeA_opacity_out, currentYOffset);
                const messegeA_translateY_in = calcValues(values.messegeA_translateY_in, currentYOffset);
                const messegeA_translateY_out = calcValues(values.messegeA_translateY_out, currentYOffset);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messegeA.style.opacity = messegeA_opacity_in;
                    objs.messegeA.style.transform = `translateY(${messegeA_translateY_in}%)`;
                } else {
                    // out
                    objs.messegeA.style.opacity = messegeA_opacity_out;
                    objs.messegeA.style.transform = `translateY(${messegeA_translateY_out}%)`;
                }
                break;

            case 1:
                // console.log('1 play');
                break;

            case 2:
                // console.log('2 play');
                break;

            case 3:
                // console.log('3 play');
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 브라우저 최상단에서 더 올릴시 바운스 효과가 생기는데 이때 currentScene이 마이너스 되는 것을 방지(모바일)
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return; // enterNewScene이 true가 될 경우(scene이 바뀔때) playAnimation함수가 실행되지 않도록 return 처리 (scene이 바뀌는 찰나의 순간 잘못된 값이 
            // 나오는 경우를 방지하기 위해)
        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset; // page의 scroll 값을 체크하는 메서드
        scrollLoop();
    });
    // window.addEventListener('DOMContentLoaded', setLayout); // DOMContent가 모두 로드 되었을 떄 setLayout 함수 실행(이미지 파일 제외)
    window.addEventListener('load', setLayout); // 모든 리소드들이 load 되었을 때, setLayout 함수 실행
    window.addEventListener('resize', setLayout); // 윈도우 크기가 변할 경우에 setLayout 함수 실행

})();