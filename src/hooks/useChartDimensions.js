import {ResizeObserver} from '@juggle/resize-observer'
import { useEffect,useRef ,useState} from 'react'

const useChartDimensions = () => {
  const ref = useRef()
  
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
      const element = ref.current
      const resizeObserver = new ResizeObserver(
        entries => {
          if (!Array.isArray(entries)) return
          if (!entries.length) return

          const entry = entries[0]

          if (width != entry.contentRect.width)
            setWidth(entry.contentRect.width)
          if (height != entry.contentRect.height)
            setHeight(entry.contentRect.height)
        }
      )
      resizeObserver.observe(element)

      return () => resizeObserver.unobserve(element)
  }, [])

  

  return [ref, width,height]
}

export default useChartDimensions;