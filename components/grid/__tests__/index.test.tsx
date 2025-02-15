import React from 'react';
import { Col, Row } from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import useBreakpoint from '../hooks/useBreakpoint';
import { render } from '../../../tests/utils';

// Mock for `responsiveObserve` to test `unsubscribe` call
jest.mock('../../_util/responsiveObserve', () => {
  const modules = jest.requireActual('../../_util/responsiveObserve');
  const originHook = modules.default;

  const useMockResponsiveObserver = (...args: any[]) => {
    const entity = originHook(...args);
    if (!entity.unsubscribe.mocked) {
      const originUnsubscribe = entity.unsubscribe;
      entity.unsubscribe = (...uArgs: any[]) => {
        const inst = global as any;
        inst.unsubscribeCnt = (inst.unsubscribeCnt || 0) + 1;

        originUnsubscribe.call(entity, ...uArgs);
      };
      entity.unsubscribe.mocked = true;
    }

    return entity;
  };

  return {
    ...modules,
    __esModule: true,
    default: useMockResponsiveObserver,
  };
});

describe('Grid', () => {
  mountTest(Row);
  mountTest(Col);

  rtlTest(Row);
  rtlTest(Col);

  beforeEach(() => {
    (global as any).unsubscribeCnt = 0;
  });

  it('should render Col', () => {
    const { asFragment } = render(<Col span={2} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should render Row', () => {
    const { asFragment } = render(<Row />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('when typeof gutter is object', () => {
    const { container } = render(<Row gutter={{ xs: 8, sm: 16, md: 24 }} />);
    expect(container.querySelector('div')!.style.marginLeft).toEqual('-4px');
    expect(container.querySelector('div')!.style.marginRight).toEqual('-4px');
  });

  it('when typeof gutter is object array', () => {
    const { container } = render(
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32, xl: 40 },
          { xs: 8, sm: 16, md: 24, lg: 32, xl: 40 },
        ]}
      />,
    );
    expect(container.querySelector('div')!.style.marginLeft).toEqual('-4px');
    expect(container.querySelector('div')!.style.marginRight).toEqual('-4px');
  });

  it('when typeof gutter is object array in large screen', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          addListener: (cb: (e: { matches: boolean }) => void) => {
            cb({ matches: query === '(min-width: 1200px)' });
          },
          removeListener: jest.fn(),
          matches: query === '(min-width: 1200px)',
        }) as any,
    );

    const { container, asFragment } = render(
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32, xl: 40 },
          { xs: 8, sm: 16, md: 24, lg: 100, xl: 400 },
        ]}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();

    expect(container.querySelector('div')!.style.marginLeft).toEqual('-20px');
    expect(container.querySelector('div')!.style.marginRight).toEqual('-20px');
    expect(container.querySelector('div')!.style.marginTop).toEqual('-200px');
    expect(container.querySelector('div')!.style.marginBottom).toEqual('-200px');
  });

  it('renders wrapped Col correctly', () => {
    const MyCol = () => <Col span={12} />;
    const { asFragment } = render(
      <Row gutter={20}>
        <div>
          <Col span={12} />
        </div>
        <MyCol />
      </Row>,
    );

    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('useResponsiveObserve.unsubscribe should be called when unmounted', () => {
    const { unmount } = render(<Row gutter={{ xs: 20 }} />);
    const called: number = (global as any).unsubscribeCnt;

    unmount();
    expect((global as any).unsubscribeCnt).toEqual(called + 1);
  });

  it('should work correct when gutter is object', () => {
    const { container } = render(<Row gutter={{ xs: 20 }} />);
    expect(container.querySelector('div')!.style.marginLeft).toEqual('-10px');
    expect(container.querySelector('div')!.style.marginRight).toEqual('-10px');
  });

  it('should work current when gutter is array', () => {
    const { container } = render(<Row gutter={[16, 20]} />);
    expect(container.querySelector('div')!.style.marginLeft).toEqual('-8px');
    expect(container.querySelector('div')!.style.marginRight).toEqual('-8px');
    expect(container.querySelector('div')!.style.marginTop).toEqual('-10px');
    expect(container.querySelector('div')!.style.marginBottom).toEqual('-10px');
  });

  // By jsdom mock, actual jsdom not implemented matchMedia
  // https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  it('should work with useBreakpoint', () => {
    const matchMediaSpy = jest.spyOn(window, 'matchMedia');
    matchMediaSpy.mockImplementation(
      (query) =>
        ({
          addListener: (cb: (e: { matches: boolean }) => void) => {
            cb({ matches: query === '(max-width: 575px)' });
          },
          removeListener: jest.fn(),
          matches: query === '(max-width: 575px)',
        }) as any,
    );

    let screensVar;
    function Demo() {
      const screens = useBreakpoint();
      screensVar = screens;
      return <div />;
    }
    render(<Demo />);

    expect(screensVar).toEqual({
      xs: true,
      sm: false,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
    });
  });

  it('should align by responsive align prop', () => {
    const matchMediaSpy = jest.spyOn(window, 'matchMedia');
    matchMediaSpy.mockImplementation(
      (query) =>
        ({
          addListener: (cb: (e: { matches: boolean }) => void) => {
            cb({ matches: query === '(max-width: 575px)' });
          },
          removeListener: jest.fn(),
          matches: query === '(max-width: 575px)',
        }) as any,
    );
    const { container } = render(<Row align="middle" />);
    expect(container.innerHTML).toContain('ant-row-middle');
    const { container: container2 } = render(<Row align={{ xs: 'middle' }} />);
    expect(container2.innerHTML).toContain('ant-row-middle');
    const { container: container3 } = render(<Row align={{ lg: 'middle' }} />);
    expect(container3.innerHTML).not.toContain('ant-row-middle');
  });

  it('should justify by responsive justify prop', () => {
    const matchMediaSpy = jest.spyOn(window, 'matchMedia');
    matchMediaSpy.mockImplementation(
      (query) =>
        ({
          addListener: (cb: (e: { matches: boolean }) => void) => {
            cb({ matches: query === '(max-width: 575px)' });
          },
          removeListener: jest.fn(),
          matches: query === '(max-width: 575px)',
        }) as any,
    );
    const { container } = render(<Row justify="center" />);
    expect(container.innerHTML).toContain('ant-row-center');
    const { container: container2 } = render(<Row justify={{ xs: 'center' }} />);
    expect(container2.innerHTML).toContain('ant-row-center');
    const { container: container3 } = render(<Row justify={{ lg: 'center' }} />);
    expect(container3.innerHTML).not.toContain('ant-row-center');
  });
});
