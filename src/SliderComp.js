import React,{Component} from "react"

export function Handle({ // your handle component
    handle: { id, value, percent }, 
    getHandleProps
  }) {
    return (
      <div
        style={{
          left: `${percent}%`,
          position: 'absolute',
          marginLeft: -15,
          marginTop: 10,
          zIndex: 2,
          width: 20,
          height: 20,
          border: '1px solid #252e38',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '25%',
          backgroundColor: '#f2bb13',
          //backgroundColor: 'repeating-linear-gradient( -45deg, #f2bb13 2px, #96740d 3px, #96740d 4px, #f2bb13 7px)',
          color: '#333',
        }}
        {...getHandleProps(id)}
      >
        <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -15 }}>
          {value}
        </div>
      </div>
    )}

 export  function Tick({ tick, count }) {  // your own tick component
        return (
          <div>
            <div
              style={{
                position: 'absolute',
                marginTop: 52,
                marginLeft: -0.5,
                width: 1,
                height: 8,
                backgroundColor: 'silver',
                left: `${tick.percent}%`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                marginTop: 60,
                fontSize: 10,
                textAlign: 'center',
                marginLeft: `${-(100 / count) / 2}%`,
                width: `${100 / count}%`,
                left: `${tick.percent}%`,
              }}
            >
              {tick.value}
            </div>
          </div>
        )
      }

    export  function Track({ source, target, getTrackProps }) { // your own track component
        return (
          <div
            style={{
              position: 'absolute',
              height: 10,
              zIndex: 1,
              marginTop: 15,
              backgroundColor: '#96740d',
              borderRadius: 3,
              cursor: 'pointer',
              left: `${source.percent}%`,
              width: `${target.percent - source.percent}%`,
            }}
            {...getTrackProps()} // this will set up events if you want it to be clickeable (optional)
          />
        )
      }