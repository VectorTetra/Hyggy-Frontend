import React from 'react'
import Layout from './sharedComponents/Layout'

const NotFound = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center bg-[#F3F3F3] relative">
                <div className='w-full overflow-hidden max-h-screen relative'>
                    <svg className='w-full h-auto' viewBox="-100 300 2200 2251" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M722.805 396.694C718.5 351 661.726 378 661.726 378C624.678 518.723 553.587 595.575 549.081 619.462C545.476 638.571 663.395 640.579 722.805 639.194C722.805 662.907 705.225 735.759 686 766.5C638 863 630.323 950.923 638 957.5L765.86 863C751.442 785.317 871 465.855 874 436.678C877 407.5 819.5 402 804.41 420.581C789.32 439.161 778.149 485.413 755 527C731.851 568.588 661.726 557.149 661.726 542.09C661.726 530.043 701.5 443 722.805 396.694Z" fill="#00AAAD" stroke="#00696A" stroke-width="4" />
                        <path d="M1253.8 455.616C1249.5 409.922 1192.73 436.922 1192.73 436.922C1155.68 577.644 1084.59 654.497 1080.08 678.383C1076.48 697.492 1194.39 699.5 1253.8 698.115C1253.8 721.829 1236.22 794.681 1217 825.422C1169 921.922 1161.32 1009.84 1169 1016.42H1351C1241 938 1402 524.777 1405 495.599C1408 466.422 1350.5 460.922 1335.41 479.502C1320.32 498.082 1309.15 544.334 1286 585.922C1262.85 627.51 1192.73 616.071 1192.73 601.012C1192.73 588.965 1232.5 501.922 1253.8 455.616Z" fill="#00AAAD" stroke="#00696A" stroke-width="4" />
                        <g filter="url(#filter0_d_1469_378)">
                            <path d="M1001.97 424.008C894.774 425.208 856.307 588.508 850.474 670.008C850.474 774.008 850.474 928.007 957.474 917.507C1064.47 907.007 1107.97 692.149 1107.97 670.008C1107.97 630 1135.97 422.508 1001.97 424.008Z" fill="#00AAAD" />
                            <path d="M1001.97 424.008C894.774 425.208 856.307 588.508 850.474 670.008C850.474 774.008 850.474 928.007 957.474 917.507C1064.47 907.007 1107.97 692.149 1107.97 670.008C1107.97 630 1135.97 422.508 1001.97 424.008Z" stroke="#00696A" stroke-width="4" stroke-linejoin="round" />
                        </g>
                        <g filter="url(#filter1_d_1469_378)">
                            <path d="M987.974 500.507C913.174 512.907 902.474 703.007 906.474 796.507C915.474 893.508 995.974 878.007 1019.97 786.507C1043.97 695.007 1081.47 485.007 987.974 500.507Z" fill="#F3F3F3" />
                            <path d="M987.974 500.507C913.174 512.907 902.474 703.007 906.474 796.507C915.474 893.508 995.974 878.007 1019.97 786.507C1043.97 695.007 1081.47 485.007 987.974 500.507Z" stroke="#00696A" stroke-width="4" stroke-linejoin="round" />
                        </g>
                        <path d="M533 1036.39L559.5 1004.89C756.5 804.394 863.5 799.394 898.5 799.394C939.5 799.394 1005.83 866.227 1040 904.894C1045.17 902.227 1054.3 891.1 1095.5 887.5C1147 883 1183.5 917.394 1219.5 942.394C1248.3 962.394 1284.83 977.727 1299.5 982.894L1376 1036.39H533Z" fill="#D9D9D9" stroke="#D9D9D9" stroke-width="5" stroke-linejoin="round" />
                        <path d="M558.474 1003.01C625.64 934.841 786.174 798.207 890.974 797.007C910.974 797.007 954.474 801.007 1042.97 902.007M1042.97 902.007C1061.81 889.507 1125 862.35 1193.5 921C1219 942.833 1278.07 983.007 1304.47 983.007M1042.97 902.007L939.474 998.007" stroke="#5D5D5D" stroke-width="3" />
                        <g filter="url(#filter2_d_1469_378)">
                            <path d="M646.474 537.008C648.874 522.608 610.14 519.008 590.474 519.008C605.974 513.341 622.474 483.008 590.474 461.508C558.473 440.008 533.14 468.508 520.474 482.008C470.974 461.508 456.64 496.675 470.974 519.008C399.474 501.008 386.974 537.008 391.974 564.008C396.974 591.008 516.474 559.008 568.474 564.008C620.474 569.008 643.474 555.008 646.474 537.008Z" fill="white" />
                            <path d="M1235.97 684.007C1220.37 716.007 1301.97 727.507 1357.47 714.507C1507.87 730.107 1533.47 721.007 1527.47 714.507C1534.27 683.707 1491.64 681.341 1469.47 684.007C1495.97 653.507 1491.47 624.507 1460.97 611.007C1436.57 600.207 1415.81 627.507 1408.47 642.507C1404.81 633.341 1389.47 616.907 1357.47 624.507C1325.47 632.107 1335.81 657.341 1344.97 669.007C1315.14 660.674 1251.57 652.007 1235.97 684.007Z" fill="white" />
                            <path d="M646.474 537.008C648.874 522.608 610.14 519.008 590.474 519.008C605.974 513.341 622.474 483.008 590.474 461.508C558.473 440.008 533.14 468.508 520.474 482.008C470.974 461.508 456.64 496.675 470.974 519.008C399.474 501.008 386.974 537.008 391.974 564.008C396.974 591.008 516.474 559.008 568.474 564.008C620.474 569.008 643.474 555.008 646.474 537.008Z" stroke="#D9D9D9" stroke-width="4" stroke-linejoin="round" />
                            <path d="M1235.97 684.007C1220.37 716.007 1301.97 727.507 1357.47 714.507C1507.87 730.107 1533.47 721.007 1527.47 714.507C1534.27 683.707 1491.64 681.341 1469.47 684.007C1495.97 653.507 1491.47 624.507 1460.97 611.007C1436.57 600.207 1415.81 627.507 1408.47 642.507C1404.81 633.341 1389.47 616.907 1357.47 624.507C1325.47 632.107 1335.81 657.341 1344.97 669.007C1315.14 660.674 1251.57 652.007 1235.97 684.007Z" stroke="#D9D9D9" stroke-width="4" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <filter id="filter0_d_1469_378" x="844.474" y="422" width="271.93" height="506.018" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1469_378" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1469_378" result="shape" />
                            </filter>
                            <filter id="filter1_d_1469_378" x="899.752" y="497.694" width="154.309" height="374.823" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1469_378" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1469_378" result="shape" />
                            </filter>
                            <filter id="filter2_d_1469_378" x="385.002" y="451.735" width="1149.26" height="281.385" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1469_378" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1469_378" result="shape" />
                            </filter>

                        </defs>

                    </svg>
                </div>
                <div className="absolute top-[80%] left-[40%]">
                    <p>Сторінку не знайдено</p>
                </div>

            </div>
        </Layout>

    )
}

export default NotFound