export default {

    data() {
        return {

            cards : [
                {
                    id: 'shapes',
                    title: 'SHAPES AND COLORS',
                    description: [
                        'Draw triangles, rectangles.',
                        'Draw regular polygons and circles.',
                        'Set position and size with units',
                        'Define color patterns',
                    ],
                    links: {
                        repository: 'https://github.com/clodoN1109/webGL_fundamentals/tree/main/01-shapes',
                        video:'https://www.youtube.com/@CodingWithClodo-tw5gg',
                        article:'https://medium.com/',
                        online_demo: './01-shapes/index.html',
                    }


                },

                {
                    id: 'motion',
                    title: 'MOTION',
                    description: [
                        'Draw triangles, rectangles.',
                        'Draw regular polygons and circles.',
                        'Set position and size with units',
                        'Define color patterns',
                    ],
                    links: {
                        repository: 'https://github.com/clodoN1109/webGL_fundamentals/tree/main/02-motion',
                        video:'https://www.youtube.com/@CodingWithClodo-tw5gg',
                        article:'https://medium.com/',
                        online_demo: './02-motion/index.html',
                    }


                },
                
                {
                    id: '3D',
                    title: '3D PRINCIPLES',
                    description: [
                        'Draw triangles, rectangles.',
                        'Draw regular polygons and circles.',
                        'Set position and size with units',
                        'Define color patterns',
                    ],
                    links: {
                        repository: 'https://github.com/clodoN1109/webGL_fundamentals/tree/main/03-intro-to-3d',
                        video:'https://www.youtube.com/@CodingWithClodo-tw5gg',
                        article:'https://medium.com/',
                        online_demo: './03-intro-to-3d/index.html',
                    }


                },
            ]
        }
    },

    template: 
        /*html*/
        `
        <div class="band-title-box">
            <div class="band-title-loose" >CODING SESSIONS</div>
        </div>
        <div class="horizontal-bar">
        
           <card v-for="cardContent in cards" :cardContent="cardContent"></card>

        </div>
        `

}
