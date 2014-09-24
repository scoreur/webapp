Scoreur webapp
=========

This repo is a HTML5/Javascript based implememtation of key functions of the Scoreur project.

Frontend
----
 - Class: LINER
 - Key Interface: 
    - LINER.initialize(html_element)
    - html_element.liner.addScores(score_sequence)
    - html_element.liner.listScoreSequences()
 
Using svg.js we implemented a fruntend interface, which not only can display score sequences but also allow users to interactively modify the score sequence, using either mouse or multi-touch.

Acknowledgement: `svg.js` library.

Backend
----
 - Class: WAVGEN
 - Key Interface:
    - WAVGEN.RENDER(score_sequence) 
    - WAVGEN.SAVE(score_sequence)
    - WAVGEN.PLAY(score_sequence)

The javascript equivalence of the initial version of C-based WAVGEN library, creating wave file by manually calculating sine wave samples.

 - Class: WAVGEN_NEW
 - Key Interface:
    - WAVGEN_NEW.RENDER(score_sequence) 
    - WAVGEN_NEW.SAVE(score_sequence)
    - WAVGEN_NEW.PLAY(score_sequence)

A new approach towards the WAVGEN library's functionality, the WAVGEN_NEW library utilizes the latest HTML5 a`audiocontext` APIs to achieve higher performance and lower latency. Now we can either render at background and save the sound samples to file, or do not render in the background and plays the scores directly to the speaker.

 - Class: MP3CODEC
 - Key Interface: encodef32data(float32Array)
 
A wrapper class for libmp3lame.js library; convert PCM wave samples to mp3 buffer.

Acknowledgement: `MP3 Lame` project.


Interactive sound generation
----
(On branch `igen`) A helper page which accepts score sequences from URL and render sounds; used by AutoComposer module.


Interactive score sequence editing
----
(On branch `primitive_webapp`) An example of frontend workflow that
 - Accepts score sequence data
 - Displays on a canvas (and allow editing)
 - Export score sequence data
 - Render sound, save it, or play it in real time


Real-time timbre recognition
----
(On branch `recording`)  
With Neural Network trained by Wang Kangning, we record ambient sound, do fourier transform on a chunk, feed it to feed forward algorithm and display the recognition result.
Currently it supports five timbre:
 - Violin
 - Trumpet
 - Clarinet
 - Marimba
 - Vocal (Male)
 

Acknowledgement: `fft.js` from RossetaCode.
