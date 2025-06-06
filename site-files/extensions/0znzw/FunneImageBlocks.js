/**!
 * Image Blocks
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @author CST1229 https://scratch.mit.edu/users/CST1229/
 * @version 1.1
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 * Inspired by TheShovel and her among us blocks, along with inline blocks.
 */
(function (Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Image-Blocks" extension must be ran unsandboxed.`);
  }
  //@ts-ignore
  var runtime = vm.runtime;
  //@ts-ignore
  const isPM = Object.hasOwn(runtime, 'ext_pm_liveTests');
  function injectPenguin(cat) {
    document
      .querySelector('g.blocklyWorkspace')
      .querySelectorAll(`g[data-category="${cat}"]`)
      .forEach((g) => {
        //@ts-ignore
        let block = vm.runtime.getEditingTarget().blocks.getBlock(g.dataset.id);
        if (block) {
          if (
            !g.querySelector('svg#dango') &&
            block.opcode === 'pmBlock0znzw_db'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="87.99945" height="88.00142" viewBox="0,0,87.99945,88.00142" id="dango">
    <!-- This icon is based on Twemoji https://twemoji.twitter.com/ -->
    <!-- License: CC-BY 4.0 https://creativecommons.org/licenses/by/4.0/ -->
    <g transform="translate(-196.00028,-135.99929)">
      <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
        <path d="M280.76164,224.00071c-0.82849,0 -1.65698,-0.31661 -2.29021,-0.94721l-80.84584,-80.84848c-1.26384,-1.26384 -1.26384,-3.31657 0,-4.58041c1.26384,-1.26384 3.31657,-1.26384 4.58041,0l80.84584,80.84584c1.26384,1.26384 1.26384,3.31657 0,4.58041c-0.63324,0.6306 -1.46173,0.94985 -2.29021,0.94985z" fill="#d99e82"/>
        <path d="M231.6304,153.81435c0,9.83892 -7.97614,17.81506 -17.81506,17.81506c-9.83892,0 -17.81506,-7.97614 -17.81506,-17.81506c0,-9.83892 7.97614,-17.81506 17.81506,-17.81506c9.83892,0 17.81506,7.97614 17.81506,17.81506z" fill="#fcb1e3"/>
        <path d="M229.16098,190.59288c-9.57565,-2.26111 -15.50524,-11.85671 -13.24412,-21.43235c2.26111,-9.57565 11.85671,-15.50524 21.43235,-13.24412c9.57565,2.26111 15.50524,11.85671 13.24412,21.43235c-2.26111,9.57565 -11.85671,15.50524 -21.43235,13.24412z" fill="#ffd983"/>
        <path d="M270.50321,192.68453c0,9.83892 -7.97878,17.81769 -17.81769,17.81769c-9.83892,0 -17.81506,-7.97878 -17.81506,-17.81769c0,-9.83892 7.97614,-17.81506 17.81506,-17.81506c9.83892,0 17.81769,7.97878 17.81769,17.81506z" fill="#a6d388"/>
        <path d="M280.76164,224.00071c-0.82849,0 -1.65698,-0.31661 -2.29021,-0.94721l-19.84141,-19.84141c-1.26648,-1.26384 -1.26648,-3.31657 0,-4.58041c1.26648,-1.26384 3.31393,-1.26384 4.58041,0l19.84141,19.84141c1.26384,1.26384 1.26384,3.31657 0,4.58041c-0.63324,0.62796 -1.46173,0.94721 -2.29021,0.94721z" fill="#d99e82"/>
      </g>
    </g>
  </svg><!--rotationCenter:44:44-->`;
          if (
            !g.querySelector('svg#penguin') &&
            block.opcode === 'pmBlock0znzw_pb'
          )
            g.innerHTML = `<svg id="penguin" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="51.51133346557617" height="92.43450164794922" viewBox="0.6872684955596924 0.6885000467300415 51.51133346557617 92.43450164794922" version="1.1" xml:space="preserve">
    <defs/>
    <g>
      <title>Slice 1</title>
      <desc>Created with Sketch.</desc>
      <g id="Page-1" fill-rule="evenodd">
        <g id="penguin-b-[animals,bird,cold,north-pole,south-pole,ice,antarctica,arctic,robert-hunter]">
          <g id="Body">
            <path d="M 29.4071 92.623 L 43.2716 92.623 C 43.2716 92.623 40.5116 89.5648 36.2091 88.0049 C 36.2091 88.0049 32.0841 86.0452 29.4071 92.623 " id="Fill-1" fill="#E3A066" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 29.1466 92.623 L 43.2716 92.623 C 43.2716 92.623 40.2616 89.4713 35.9591 87.9118 " id="Stroke-3" stroke="#8D6A4A" stroke-width="0.5" fill="none"/>
            <path d="M 24.9591 92.623 L 38.8236 92.623 C 38.8236 92.623 37.3861 90.4552 33.0836 88.8952 C 33.0836 88.8952 28.0426 89.4809 24.9591 92.623 " id="Fill-5" fill="#E3A066" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 24.6986 92.623 L 38.8236 92.623 C 38.8236 92.623 37.3861 90.4552 33.0836 88.8952 " id="Stroke-7" stroke="#8D6A4A" stroke-width="0.5" fill="none"/>
            <path d="M 34.2611 4.6448 C 32.3521 2.5333 27.7716 1.1885 25.6051 1.1885 C 23.4381 1.1885 20.1661 2.2312 18.4941 4.3929 C 16.0876 7.5038 16.4486 13.7644 16.0736 15.3037 C 15.6986 16.8436 10.3866 29.7935 7.2091 36.6186 C 4.4721 42.496 0.8756 55.1694 1.2091 68.3244 C 1.5426 81.4794 12.1256 92.623 12.3756 92.623 L 24.9591 92.623 C 27.0426 90.1927 32.3756 88.854 32.7921 88.8525 C 33.2506 88.8494 34.2716 88.7715 35.2926 88.8947 C 35.2926 88.8947 34.1051 88.1195 33.7716 86.9466 C 33.7716 86.9466 34.8551 88.2663 36.2091 88.4342 C 36.2091 88.4342 35.3461 87.6474 35.1046 86.7792 C 34.9591 86.2553 33.4591 58.9399 33.4591 58.2697 C 33.4591 57.8032 34.1086 30.0433 34.0841 16.6651 C 32.2936 15.8618 33.6986 13.0656 33.6986 13.0656 C 33.6986 13.0656 37.6986 8.4465 34.2611 4.6448 " id="Fill-9" fill="#3E5766" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 34.6654 17.3918 C 34.6654 17.3918 30.0154 21.9893 29.5709 29.3629 C 29.1259 36.736 22.2089 70.0008 21.4589 73.4359 C 20.7089 76.8711 25.3859 88.9593 35.2924 88.8949 C 35.2924 88.8949 33.7714 88.078 33.7714 86.9469 C 33.7714 86.9469 35.4339 88.4581 36.1009 88.4163 C 36.1009 88.4163 35.5424 87.9116 35.1464 86.9373 C 35.1464 86.9373 35.8549 88.6013 38.2509 87.428 C 38.2509 87.428 36.5194 87.1117 36.4364 86.0641 C 36.4364 86.0641 37.5424 85.962 38.3759 85.962 C 38.3759 85.962 36.4079 84.8253 36.9164 83.9395 C 40.6259 77.4784 41.7099 69.3316 42.8589 56.6371 C 44.1049 42.8738 41.8549 31.3733 38.3549 23.6232 C 36.7609 20.2348 34.6654 17.3918 34.6654 17.3918 " id="Fill-11" fill="#FBF8EA" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 29.7403 27.2739 C 29.7364 27.387 32.5904 19.3171 35.7448 18.9084 L 34.0838 16.6652 C 34.0838 16.6652 30.0739 17.9673 29.7403 27.2739 " id="Fill-13" fill="#F0C579" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 33.2508 14.2804 C 33.2508 14.2804 32.8008 15.2663 33.3758 15.8726 C 34.0913 16.6267 44.9933 27.8255 42.9594 55.3371 C 41.2923 77.8761 37.5538 82.4524 37.1328 83.3795 C 36.8524 83.9963 36.3659 84.956 38.3758 85.9615 C 38.3758 85.9615 37.1354 86.1163 36.4363 86.0641 C 36.4363 86.0641 36.9074 87.0087 38.2508 87.428 C 38.2508 87.428 37.5844 88.3354 35.3344 87.6653 " id="Stroke-15" stroke="#D1C1B5" stroke-width="0.5" fill="none"/>
            <path d="M 35.1048 86.7792 C 35.2923 87.6605 36.2088 88.4342 36.2088 88.4342 C 34.8548 88.2663 33.7713 86.9466 33.7713 86.9466 C 34.1048 88.1195 35.2923 88.8947 35.2923 88.8947 C 34.2713 88.7715 33.2503 88.8494 32.7923 88.8525 C 32.3758 88.854 27.0423 90.1927 24.9589 92.623 L 12.3758 92.623 C 12.1258 92.623 1.5423 81.4794 1.2088 68.3244 C 0.8759 55.1694 4.4724 42.496 7.2088 36.6186 C 10.3869 29.7935 15.6983 16.8436 16.0733 15.3037 C 16.4483 13.7644 16.0878 7.5038 18.4938 4.3929 C 20.1664 2.2312 23.4383 1.1885 25.6048 1.1885 C 27.7714 1.1885 32.4278 2.4665 34.2614 4.6448 " id="Stroke-27" stroke="#2E374A" stroke-width="0.5" fill="none"/>
          </g>
          <g id="Beak">
            <path d="M 30.6361 12.6257 C 30.5381 12.6398 34.8716 10.199 35.1986 8.2268 C 35.4486 6.7186 33.8236 5.053 34.2611 4.6448 C 34.5526 4.3723 35.2041 5.8222 36.4801 6.4672 C 37.8456 7.158 39.7611 8.1639 42.9171 8.6038 C 46.0736 9.0437 48.7926 9.8923 49.9486 11.1175 C 51.1051 12.3431 51.6986 13.694 51.6986 13.694 C 51.6986 13.694 50.2301 11.4 41.4796 12.2803 C 34.7611 12.6257 34.2506 13.6417 33.2506 14.2807 C 32.2506 14.9191 33.4486 12.2175 30.6361 12.6257 " id="Fill-17" fill="#E3A066" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 32.8861 12.4057 C 32.8861 12.4057 33.1656 12.3082 33.6621 12.1785 C 33.9116 12.1167 34.2146 12.0418 34.5621 11.9553 C 34.7366 11.9146 34.9226 11.8713 35.1181 11.8256 C 35.3146 11.7829 35.5256 11.7708 35.7426 11.7356 C 37.4851 11.4983 39.8206 11.249 42.1696 11.2102 C 43.3441 11.1896 44.5206 11.2198 45.6206 11.3188 C 46.1711 11.3681 46.7011 11.44 47.2021 11.5199 C 47.7026 11.6089 48.1731 11.712 48.6031 11.8276 C 48.8146 11.898 49.0261 11.9382 49.2146 12.0176 C 49.3996 12.1031 49.5756 12.1845 49.7406 12.2604 C 50.0621 12.4344 50.3386 12.5847 50.5496 12.7396 C 50.7701 12.8768 50.9176 13.0206 51.0231 13.1091 C 51.1271 13.1996 51.1831 13.2473 51.1831 13.2473 C 51.1831 13.2473 51.1196 13.2101 51.0006 13.1402 C 50.8821 13.0703 50.7131 12.9638 50.4796 12.8617 C 50.2551 12.7441 49.9636 12.64 49.6341 12.5224 C 49.2961 12.4223 48.9156 12.3228 48.5041 12.1911 C 48.0871 12.079 47.6291 11.9784 47.1396 11.8919 C 46.6486 11.8135 46.1286 11.7431 45.5871 11.6944 C 44.5036 11.5968 43.3401 11.5672 42.1766 11.5873 C 39.8481 11.6255 37.5251 11.8733 35.7936 12.1096 C 35.3631 12.186 34.9626 12.2167 34.6066 12.2393 C 34.2516 12.2705 33.9421 12.2982 33.6871 12.3208 C 33.4321 12.3454 33.2316 12.365 33.0946 12.3786 C 32.9601 12.3917 32.8861 12.4057 32.8861 12.4057 " id="Fill-19" fill="#8D6A4A" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 30.6361 12.6257 C 30.5381 12.6398 34.8716 10.199 35.1986 8.2268 C 35.4486 6.7186 33.8236 5.053 34.2611 4.6448 C 34.5526 4.3723 35.2041 5.8222 36.4801 6.4672 C 37.8456 7.158 39.7611 8.1639 42.9171 8.6038 C 46.0736 9.0437 48.7926 9.8923 49.9486 11.1175 C 51.1051 12.3431 51.6986 13.694 51.6986 13.694 C 51.6986 13.694 50.2301 11.4 41.4796 12.2803 C 34.7611 12.6257 34.2506 13.6417 33.2506 14.2807 C 32.2506 14.9191 33.4486 12.2175 30.6361 12.6257 Z " id="Stroke-21" stroke="#8D6A4A" stroke-width="0.5" fill="none"/>
          </g>
          <g id="Eye">
            <path d="M 27.1986 6.8958 C 27.2766 6.2362 28.2301 5.639 29.6986 5.7018 C 31.6516 5.8587 31.9556 6.8485 31.9486 7.2412 C 31.9401 7.7168 31.8101 8.404 29.5756 8.404 C 27.6671 8.404 27.1286 7.4885 27.1986 6.8958 " id="Fill-23" fill="#E2E3E4" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 29.9642 8.3839 C 29.9642 8.3839 29.1988 7.9128 29.3547 7.017 C 29.5108 6.1241 30.4277 5.927 30.7733 5.9587 C 31.1187 5.9899 31.3963 6.286 31.3963 6.286 C 31.3963 6.286 32.1363 6.844 31.9488 7.4568 C 31.7613 8.0697 30.8343 8.3427 30.8343 8.3427 C 30.8343 8.3427 30.0877 8.4467 29.9642 8.3839 " id="Fill-25" fill="#2E374A" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 27.1986 6.9385 C 27.2766 6.2789 28.2301 5.6817 29.6986 5.7445 C 31.6516 5.9014 31.9556 6.8913 31.9486 7.2839 C 31.9401 7.7595 31.8101 8.4467 29.5756 8.4467 C 27.6671 8.4467 27.1286 7.5312 27.1986 6.9385 Z " id="Stroke-29" stroke="#2E374A" stroke-width="0.5" fill="none"/>
          </g>
          <g id="Group-34">
            <path d="M 18.6983 32.5464 C 18.6983 32.5464 15.9588 33.8872 14.9658 37.6215 C 14.1944 40.5208 10.4588 62.6269 10.4588 62.6269 C 10.4588 62.6269 10.0424 66.8167 11.0424 68.6597 C 12.0423 70.5027 13.3758 74.4411 13.2088 77.7089 C 13.0423 80.9767 12.7923 82.0656 13.5423 82.5683 C 14.2923 83.071 24.2094 72.2623 26.3758 61.9563 C 28.5423 51.6503 28.5934 39.8361 27.1928 34.0546 " id="Fill-31" fill="#3E5766" fill-rule="nonzero" stroke-width="1" stroke="none"/>
            <path d="M 18.6983 32.5464 C 18.6983 32.5464 15.9588 33.8872 14.9658 37.6215 C 14.1944 40.5208 10.4588 62.6269 10.4588 62.6269 C 10.4588 62.6269 10.0424 66.8167 11.0424 68.6597 C 12.0423 70.5027 13.3758 74.4411 13.2088 77.7089 C 13.0423 80.9767 12.7923 82.0656 13.5423 82.5683 C 14.2923 83.071 24.2094 72.2623 26.3758 61.9563 C 28.5423 51.6503 28.5934 39.8361 27.1928 34.0546 " id="Stroke-33" stroke="#2E374A" stroke-width="0.5" fill="none"/>
          </g>
        </g>
      </g>
    </g>
  </svg><!--rotationCenter:26:47-->`;

          if (
            !g.querySelector('svg#0znzw') &&
            block.opcode === 'pmBlock0znzw_test'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92" viewBox="0,0,92,92" id="0znzw">
  <image href="https://corsproxy.io/?https://cdn.discordapp.com/avatars/1124880299302592643/de911c4365c9e90483a94282efd2acf8.webp?size=128" height="92" width="92" />
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#lily') &&
            block.opcode === 'pmBlock0znzw_lily'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92" viewBox="0,0,92,92" id="lily">
  <image href="https://corsproxy.io/?https://cdn.discordapp.com/avatars/568867130418921532/4699dba98491a698e5879ba125f24ac9.webp?size=128" height="92" width="92" />
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#jeremy') &&
            block.opcode === 'pmBlock0znzw_jeremy'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92" viewBox="0,0,92,92" id="jeremy">
  <image href="https://corsproxy.io/?https://cdn.discordapp.com/avatars/462098932571308033/c73514e047487ce73f945717977c7afd.webp?size=128" height="92" width="92" />
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#moneutils') &&
            block.opcode === 'pmBlock0znzw_moneutils'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92" viewBox="0,0,92,92" id="moneutils">
  <image href="https://corsproxy.io/?https://cdn.discordapp.com/avatars/977995410234826814/7e794676cb8a82aabb0a40d01f33ce7a.webp?size=128" height="92" width="92" />
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#mrbeast') &&
            block.opcode === 'pmBlock0znzw_mrbeast'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="200" viewBox="0,0,300,200" id="mrbeast">
              <foreignObject width="500" height="400">
                  <video xmlns="http://www.w3.org/1999/xhtml" width="300" height="200" autoplay="">
                      <source src="https://penguinmod.com/mrbeast.mp4" type="video/mp4" />
                  </video>
              </foreignObject>
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#garbo') &&
            block.opcode === 'pmBlock0znzw_garbomuffin'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92" height="92" viewBox="0,0,92,92" id="garbo">
  <image href="https://corsproxy.io/?https://uploads.scratch.mit.edu/get_image/user/17340565_92x92.png" height="92" width="92" />
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#funneline') &&
            block.opcode === 'pmBlock0znzw_funneline'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1" height="500" viewBox="0,0,92,92" id="funneline">
  <image href="https://corsproxy.io/?https://i.ibb.co/RvrX4MK/lmao.png" height="1" width="500" />
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#trol') &&
            block.opcode === 'pmBlock0znzw_trol'
          )
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="2000" height="2000" viewBox="0,0,2000,2000" id="trol">
              <foreignObject width="2100" height="2100">
                  <video xmlns="http://www.w3.org/1999/xhtml" width="2000" height="2000" autoplay="" muted="" loop="">
                      <source src="https://images-ext-2.discordapp.net/external/glXwDOcOgz85FoIO8UVuramrWktClzZkPFA1glSnNzQ/https/media.tenor.com/dgOeYF87AdoAAAPo/troll-troll-face.mp4" type="video/mp4" />
                  </video>
              </foreignObject>
  </svg><!--rotationCenter:0:0-->`;

          if (
            !g.querySelector('svg#DOOMSVG') &&
            block.opcode === 'pmBlock0znzw_doom'
          ) {
            g.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="640" height="400" viewBox="0,0,640,400" id="DOOMSVG">
              <foreignObject width="650" height="410" id="DOOMOBJ">
              </foreignObject>
  </svg><!--rotationCenter:0:0-->`;
            let frame = document.createElement('iframe');
            // @ts-ignore
            frame.width = 640;
            //@ts-ignore
            frame.height = 400;
            frame.id = 'DOOM';
            g.querySelector('foreignObject#DOOMOBJ').appendChild(frame);
            /**
             * 
             * ORIGINAL: https://diekmann.github.io/wasm-fizzbuzz/doom/
             * Ported for use in turbowarp blocks
             * 
            */
           //@ts-ignore
            frame.srcdoc = atob(
              `PCEtLSBPUklHSU5BTDogaHR0cHM6Ly9kaWVrbWFubi5naXRodWIuaW8vd2FzbS1maXp6YnV6ei9kb29tLyAtLT48IWRvY3R5cGVodG1sPjxodG1sPjxib2R5PjxET09NPjxzdHlsZT4jb3V0cHV0e2JvcmRlcjozcHggZ3Jvb3ZlICM3ZmZmZDQ7YmFja2dyb3VuZC1jb2xvcjpiaXNxdWU7d2lkdGg6NTUwcHg7aGVpZ2h0OjQwMHB4O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSxzZXJpZjtmb250LXNpemU6MTBweDtvdmVyZmxvdy15OnNjcm9sbH0jb3V0cHV0IHNwYW4ubG9ne2NvbG9yOiM0ODNkOGJ9I291dHB1dCBzcGFuLnN0ZG91dHtjb2xvcjojMDAwfSNvdXRwdXQgc3Bhbi5zdGRlcnJ7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOmJyb3dufS5jb250YWluZXJ7ZGlzcGxheTpmbGV4fSp7bWFyZ2luOjBweDtwYWRkaW5nOjBweH08L3N0eWxlPjxzcGFuIGhpZGRlbj48cCBpZD1mb2N1c2hpbnQ+PC9wPjxwPjxidXR0b24gaWQ9ZW50ZXJCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1sZWZ0QnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9dXBCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1kb3duQnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9cmlnaHRCdXR0b24+PC9idXR0b24+IDxidXR0b24gaWQ9Y3RybEJ1dHRvbj48L2J1dHRvbj48YnV0dG9uIGlkPXNwYWNlQnV0dG9uPjwvYnV0dG9uPiA8YnV0dG9uIGlkPWFsdEJ1dHRvbj48L2J1dHRvbj48L3A+PC9zcGFuPjxkaXYgY2xhc3M9Y29udGFpbmVyPjxjYW52YXMgaGVpZ2h0PTQwMCBpZD1zY3JlZW4gdGFiaW5kZXg9MCB3aWR0aD02NDA+VGhpcyBpcyB3aGVyZSB0aGUgRG9vTSBzY3JlZW4gc2hvdWxkIHJlbmRlci48L2NhbnZhcz48ZGl2IGhpZGRlbiBpZD1vdXRwdXQ+PC9kaXY+PC9kaXY+PHNwYW4gaGlkZGVuPjxzcGFuIGlkPWdldG1zcHNfc3RhdHM+PC9zcGFuPjxzcGFuIGlkPWdldG1zX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9ZnBzX3N0YXRzPjwvc3Bhbj48c3BhbiBpZD1kcmF3ZnJhbWVzX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9YW5pbWF0aW9uZnBzX3N0YXRzPjwvc3Bhbj48L3NwYW4+PHNjcmlwdCBkZWZlcj4idXNlIHN0cmljdCI7dmFyIG1lbW9yeT1uZXcgV2ViQXNzZW1ibHkuTWVtb3J5KHtpbml0aWFsOjEwOH0pO2NvbnN0IG91dHB1dD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgib3V0cHV0Iik7ZnVuY3Rpb24gcmVhZFdhc21TdHJpbmcodCxlKXtsZXQgbj1uZXcgVWludDhBcnJheShtZW1vcnkuYnVmZmVyLHQsZSk7cmV0dXJuIG5ldyBUZXh0RGVjb2RlcigidXRmOCIpLmRlY29kZShuKX1mdW5jdGlvbiBjb25zb2xlTG9nU3RyaW5nKHQsZSl7bGV0IG49cmVhZFdhc21TdHJpbmcodCxlKTtjb25zb2xlLmxvZygnIicrbisnIicpfWZ1bmN0aW9uIGFwcGVuZE91dHB1dCh0KXtyZXR1cm4gZnVuY3Rpb24oZSxuKXtsZXQgcz1yZWFkV2FzbVN0cmluZyhlLG4pLnNwbGl0KCJcbiIpO2Zvcih2YXIgYT0wO2E8cy5sZW5ndGg7KythKWlmKDAhPXNbYV0ubGVuZ3RoKXt2YXIgcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJzcGFuIik7ci5jbGFzc0xpc3QuYWRkKHQpLHIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc1thXSkpLG91dHB1dC5hcHBlbmRDaGlsZChyKSxvdXRwdXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYnIiKSksci5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6InNtb290aCIsYmxvY2s6ImVuZCIsaW5saW5lOiJuZWFyZXN0In0pfX19Y29uc3QgZ2V0bXNwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZ2V0bXNwc19zdGF0cyIpLGdldG1zX3N0YXRzPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJnZXRtc19zdGF0cyIpO3ZhciBnZXRtc19jYWxsc190b3RhbD0wLGdldG1zX2NhbGxzPTA7ZnVuY3Rpb24gZ2V0TWlsbGlzZWNvbmRzKCl7cmV0dXJuKytnZXRtc19jYWxscyxwZXJmb3JtYW5jZS5ub3coKX13aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtnZXRtc19jYWxsc190b3RhbCs9Z2V0bXNfY2FsbHMsZ2V0bXNwc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHMvMWUzKyJrIixnZXRtc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHNfdG90YWwsZ2V0bXNfY2FsbHM9MH0sMWUzKTtjb25zdCBjYW52YXM9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNjcmVlbiIpLGRvb21fc2NyZWVuX3dpZHRoPTY0MCxkb29tX3NjcmVlbl9oZWlnaHQ9NDAwLGZwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZnBzX3N0YXRzIiksZHJhd2ZyYW1lc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZHJhd2ZyYW1lc19zdGF0cyIpO3ZhciBudW1iZXJfb2ZfZHJhd3NfdG90YWw9MCxudW1iZXJfb2ZfZHJhd3M9MDtmdW5jdGlvbiBkcmF3Q2FudmFzKHQpe3ZhciBlPW5ldyBVaW50OENsYW1wZWRBcnJheShtZW1vcnkuYnVmZmVyLHQsMTAyNGUzKSxuPW5ldyBJbWFnZURhdGEoZSw2NDAsNDAwKTtjYW52YXMuZ2V0Q29udGV4dCgiMmQiKS5wdXRJbWFnZURhdGEobiwwLDApLCsrbnVtYmVyX29mX2RyYXdzfXdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpe251bWJlcl9vZl9kcmF3c190b3RhbCs9bnVtYmVyX29mX2RyYXdzLGRyYXdmcmFtZXNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3c190b3RhbCxmcHNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3cyxudW1iZXJfb2ZfZHJhd3M9MH0sMWUzKTt2YXIgaW1wb3J0T2JqZWN0PXtqczp7anNfY29uc29sZV9sb2c6YXBwZW5kT3V0cHV0KCJsb2ciKSxqc19zdGRvdXQ6YXBwZW5kT3V0cHV0KCJzdGRvdXQiKSxqc19zdGRlcnI6YXBwZW5kT3V0cHV0KCJzdGRlcnIiKSxqc19taWxsaXNlY29uZHNfc2luY2Vfc3RhcnQ6Z2V0TWlsbGlzZWNvbmRzLGpzX2RyYXdfc2NyZWVuOmRyYXdDYW52YXN9LGVudjp7bWVtb3J5Om1lbW9yeX19O1dlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKGZldGNoKCJodHRwczovL21peW8ubG9sL2Rvb20ud2FzbSIpLGltcG9ydE9iamVjdCkudGhlbih0PT57dC5pbnN0YW5jZS5leHBvcnRzLm1haW4oKTtsZXQgZT1mdW5jdGlvbih0KXtzd2l0Y2godCl7Y2FzZSA4OnJldHVybiAxMjc7Y2FzZSAxNzpyZXR1cm4gMTU3O2Nhc2UgMTg6cmV0dXJuIDE4NDtjYXNlIDM3OnJldHVybiAxNzI7Y2FzZSAzODpyZXR1cm4gMTczO2Nhc2UgMzk6cmV0dXJuIDE3NDtjYXNlIDQwOnJldHVybiAxNzU7ZGVmYXVsdDppZih0Pj02NSYmdDw9OTApcmV0dXJuIHQrMzI7aWYodD49MTEyJiZ0PD0xMjMpcmV0dXJuIHQrNzU7cmV0dXJuIHR9fSxuPWZ1bmN0aW9uKGUpe3QuaW5zdGFuY2UuZXhwb3J0cy5hZGRfYnJvd3Nlcl9ldmVudCgwLGUpfSxzPWZ1bmN0aW9uKGUpe3QuaW5zdGFuY2UuZXhwb3J0cy5hZGRfYnJvd3Nlcl9ldmVudCgxLGUpfTtjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigia2V5ZG93biIsZnVuY3Rpb24odCl7bihlKHQua2V5Q29kZSkpLHQucHJldmVudERlZmF1bHQoKX0sITEpLGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCJrZXl1cCIsZnVuY3Rpb24odCl7cyhlKHQua2V5Q29kZSkpLHQucHJldmVudERlZmF1bHQoKX0sITEpLFtbImVudGVyQnV0dG9uIiwxM10sWyJsZWZ0QnV0dG9uIiwxNzJdLFsicmlnaHRCdXR0b24iLDE3NF0sWyJ1cEJ1dHRvbiIsMTczXSxbImRvd25CdXR0b24iLDE3NV0sWyJjdHJsQnV0dG9uIiwxNTddLFsic3BhY2VCdXR0b24iLDMyXSxbImFsdEJ1dHRvbiIsMTg0XV0uZm9yRWFjaCgoW3QsZV0pPT57Y29uc29sZS5sb2codCsiIGZvciAiK2UpO3ZhciBhPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHQpO2EuYWRkRXZlbnRMaXN0ZW5lcigidG91Y2hzdGFydCIsKCk9Pm4oZSkpLGEuYWRkRXZlbnRMaXN0ZW5lcigidG91Y2hlbmQiLCgpPT5zKGUpKSxhLmFkZEV2ZW50TGlzdGVuZXIoInRvdWNoY2FuY2VsIiwoKT0+cyhlKSl9KTtsZXQgYT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZm9jdXNoaW50Iikscj1mdW5jdGlvbih0KXthLmlubmVyVGV4dD0iS2V5Ym9hcmQgZXZlbnRzIHdpbGwgYmUgY2FwdHVyZWQgYXMgbG9uZyBhcyB0aGUgdGhlIERPT00gY2FudmFzIGhhcyBmb2N1cy4iLGEuc3R5bGUuZm9udFdlaWdodD0ibm9ybWFsIn07Y2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoImZvY3VzaW4iLHIsITEpLGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCJmb2N1c291dCIsZnVuY3Rpb24odCl7YS5pbm5lclRleHQ9IkNsaWNrIG9uIHRoZSBjYW52YXMgdG8gY2FwdXRlIGlucHV0IGFuZCBzdGFydCBwbGF5aW5nLiIsYS5zdHlsZS5mb250V2VpZ2h0PSJib2xkIn0sITEpLGNhbnZhcy5mb2N1cygpLHIoKTtsZXQgbz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYW5pbWF0aW9uZnBzX3N0YXRzIik7dmFyIHU9MDtmdW5jdGlvbiBjKGUpeysrdSx0Lmluc3RhbmNlLmV4cG9ydHMuZG9vbV9sb29wX3N0ZXAoKSx3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGMpfXdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpe28uaW5uZXJUZXh0PXUsdT0wfSwxZTMpLHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYyl9KTs8L3NjcmlwdD48L0RPT00+PC9ib2R5PjwvaHRtbD4=`
            );
          }
        }
      });
  }
  function label(text, hideFromPalette) {
    hideFromPalette = hideFromPalette ?? false;
    return { blockType: 'label', text, hideFromPalette };
  }
  class penguin {
    getInfo() {
      return {
        id: 'pmBlock0znzw',
        name: '0znzw | Image blocks',
        blocks: [
          //we have to use a 0 width character or it will not display correctly
          // i use https://unicode-explorer.com/c/200E
          label('Penguin'),
          {
            disableReporter: true,
            blockType: 'reporter',
            opcode: 'pb',
            text: '‎',
          },
          label('Dango'),
          {
            disableReporter: true,
            blockType: 'reporter',
            opcode: 'db',
            text: '‎',
          },
          label('Test'),
          {
            disableReporter: true,
            blockType: 'reporter',
            opcode: 'test',
            text: '‎',
          },
          label('Lily', isPM),
          {
            disableReporter: true,
            //pm devs dont like lily :((( so i hide block
            hideFromPalette: isPM,
            blockType: 'reporter',
            opcode: 'lily',
            text: '‎',
          },
          label('Jeremy'),
          {
            blockType: 'reporter',
            opcode: 'jeremy',
            text: '‎',
          },
          label('SharkPool', !isPM),
          {
            disableReporter: true,
            //heheheheheh
            hideFromPalette: !isPM,
            blockType: 'reporter',
            opcode: 'moneutils',
            text: '‎',
          },
          label('MrBeast', !isPM),
          {
            disableReporter: true,
            hideFromPalette: !isPM,
            blockType: 'reporter',
            opcode: 'mrbeast',
            text: '‎',
          },
          // i hid garbo cause his pfp is just bland :sob:
          label('GarboMuffin', true),
          {
            disableReporter: true,
            hideFromPalette: true,
            blockType: 'reporter',
            opcode: 'garbomuffin',
            text: '‎',
          },
          label('Funne line'),
          {
            blockType: 'reporter',
            opcode: 'funneline',
            text: '‎',
          },
          label('???'),
          {
            blockType: 'reporter',
            opcode: 'trol',
            text: '‎',
          },
          label('DOOM Linux Demo', isPM),
          {
            disableReporter: true,
            hideFromPalette: isPM,
            blockType: 'reporter',
            opcode: 'doom',
            text: '‎',
          },
        ],
      };
    }
    pb() {
      return 'Penguin Block';
    }
    db() {
      return 'Dango Block';
    }
    test() {
      return 'Test Block';
    }
    lily() {
      return 'lily makes blocks';
    }
    jeremy() {
      return '';
    }
    moneutils() {
      return '*insert ad here*';
    }
    mrbeast() {
      return 'why do ppl like this lmao';
    }
    garbomuffin() {
      return 'no funny on the gallery';
    }
    funneline() {
      return '';
    }
    trol() {
      return 'bananna';
    }
    doom() {
      return '';
    }
  }
  function spawnPm() {
    //blockly uses the category name????
    setTimeout(() => {
      injectPenguin('0znzw | Image blocks');
    }, 25);
  }
  //@ts-ignore
  vm.runtime.on('PROJECT_CHANGED', spawnPm);
  //@ts-ignore
  vm.runtime.on('BLOCK_DRAG_UPDATE', spawnPm);
  //@ts-ignore
  vm.runtime.on('BLOCK_DRAG_END', spawnPm);
  //updating reportvisual to check for special blocks
  //thanks cst1229
  const PATCHES_ID = '__patches_';
  //@ts-ignore
  window.patch = (obj, functions) => {
    if (obj[PATCHES_ID]) return;
    obj[PATCHES_ID] = {};
    for (const name in functions) {
      const original = obj[name];
      obj[PATCHES_ID][name] = obj[name];
      if (original) {
        obj[name] = function (...args) {
          const callOriginal = (...args) => original.call(this, ...args);
          return functions[name].call(this, callOriginal, ...args);
        };
      } else {
        obj[name] = function (...args) {
          return functions[name].call(this, () => {}, ...args);
        };
      }
    }
  };
  //@ts-ignore
  window.unpatch = (obj) => {
    if (!obj[PATCHES_ID]) return;
    for (const name in obj[PATCHES_ID]) {
      obj[name] = obj[PATCHES_ID][name];
    }
    obj[PATCHES_ID] = null;
  };

  //@ts-ignore
  patch(runtime.constructor.prototype, {
    visualReport(original, blockId, value) {
      let block;
      //@ts-ignore
      if (vm.editingTarget) block = vm.editingTarget.blocks.getBlock(blockId);
      //@ts-ignore
      if (!block) block = vm.runtime.flyoutBlocks.getBlock(blockId);
      original(blockId, value);
      //@ts-ignore
      if (vm.runtime.getEditingTarget().blocks.getBlock([blockId]))
        setTimeout(() => {
          document.querySelectorAll('div.blocklyDropDownDiv').forEach((div) => {
            var reportBox = div.querySelector('div.valueReportBox');
            //@ts-ignore
            let block = vm.runtime
              .getEditingTarget()
              .blocks.getBlock([blockId]);
            if (reportBox && block) {
              switch (block.opcode) {
                case 'pmBlock0znzw_trol':
                  //@ts-ignore
                  div.style.transform = 'translate(700px, 1285px)';
                  //@ts-ignore
                  if (!Object.hasOwn(window, 'rr_')) {
                    var rr = new Audio();
                    rr.loop = true;
                    rr.onload = () => {
                      rr.play();
                    };
                    rr.src =
                      'https://ia802505.us.archive.org/24/items/nvrgnnagvuup/rickroll.mp3';
                    //@ts-ignore
                    window.rr_ = 'funne';
                  }
                  rr.pause();
                  //@ts-ignore
                  rr.time = 0;
                  rr.play();
                  break;
                case 'pmBlock0znzw_pb':
                  //@ts-ignore
                  div.style.transform = 'translate(0px, 50px)';
                  break;
                case 'pmBlock0znzw_db':
                  //@ts-ignore
                  div.style.transform = 'translate(35px, 50px)';
                  break;
                case 'pmBlock0znzw_test':
                  //@ts-ignore
                  div.style.transform = 'translate(15px, 50px)';
                  break;
                case 'pmBlock0znzw_lily':
                  //@ts-ignore
                  div.style.transform = 'translate(15px, 50px)';
                  break;
                case 'pmBlock0znzw_jeremy':
                  //@ts-ignore
                  div.style.transform = 'translate(15px, 50px)';
                  break;
                case 'pmBlock0znzw_moneutils':
                  //@ts-ignore
                  div.style.transform = 'translate(15px, 50px)';
                  break;
                case 'pmBlock0znzw_mrbeast':
                  //@ts-ignore
                  div.style.transform = 'translate(95px, 105px)';
                  break;
                case 'pmBlock0znzw_garbomuffin':
                  //@ts-ignore
                  div.style.transform = 'translate(15px, 50px)';
                  break;
                  case 'pmBlock0znzw_doom':
                    //@ts-ignore
                    div.style.display = 'none';
                    break;
              }
            }
          });
        }, 25);
    },
  });
  //@ts-ignore
  Scratch.extensions.register(new penguin());
})(Scratch);
