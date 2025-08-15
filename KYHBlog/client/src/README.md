# src

- src 폴더내의 내용과 관련된 문서

## **Rules**

- ## **className**

    - ## 대문자로 시작한다.

        - tailwind 랑 구분하기 위함

    - ## tsx 파일의 최상위 컴포넌트의 className 은 다음과 같이 넣는다.

        - className={ \` 컴포넌트_이름 기타_클래스 ${className || ''} \` }

            - 맨 앞과 맨 뒤는 따음표가 아니라 백틱( \` ) 이다.

            - 컴포넌트 본인의 클래스명(컴포넌트_이름)은 본인이 명명한다.

                - 상위 컴포넌트에서 넘겨주지 않는다.

            - 기타_클래스는 스타일등을 위해 쓰이는 클래스이다.

            - className 은 상위 컴포넌트에서 넘겨주는 className 이다.

    - ## tsx 파일의 html 요소들의 className 은 다음과 같이 넣는다.

        - className="컴포넌트_이름  기타_클래스"

    - ## 스타일용 className 은 다음 규칙으로 넣는다.

        - 파일이름_고유이름

        - 파일이름 및 고유이름은 camel 표기법으로 적는다.

            - AppButton.scss 의 Sakura 는

            - AppButton_Sakura 로 적는다.

        - 파일이름은 '컴포넌트이름 + 고유이름' 을 Camel 표기법으로 적는다.

            - App.tsx 에서 쓰이는 Button 용 scss 는

            - AppButton.scss 혹은 AppButton

        - 부모 클래스명의 하위 클래스명인 경우는 맨 앞에 _ 를 붙인다.
            
            - AppButton_Sakura 내부에 InputRow 로 클래스명을 주지 말고

            - _InputRow 로 클래스명을 줘라

            - 어느 파일에 정의되어있는지 쉽게 파악하기 위함


- ## **import**

    - ## 다음 우선순위로 import 구문을 적는다.

        - ### 최상위 우선순위 (import 형태)

            1. import yes from 모듈

            2. import {yes} from 모듈

            3. import type {yes} from 모듈

            4. import * as yes from 모듈

        - ### 내부 우선순위 (모듈 경로 형태)

            1. import ~ from "yes"

            2. import ~ from @yes

            3. import ~ from "./yes"

        - ### 가나다 및 알파벳 순서


- ## **tsx 파일**

    - ### tsx 코드 작성 순서

        1. import 구문

        2. 변수, 타입

        3. Function Component

        4. export 구문 (opt)

    - ### Function Component 코드 작성 순서

        1. context 에서 가져올 변수 및 함수

        2. hook 으로 생성할 변수 및 함수

            1. useState

            2. 기타 hook

            3. useCallback 은 제외

        3. 기타 변수들

        4. CSSProperty 변수

        5. useCallback 함수

        6. useEffect
        
        7. 렌더링 구문