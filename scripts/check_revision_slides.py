#!/usr/bin/env python3
"""Re-run the recorded program cases in the Week 5--12 revision packages."""
from pathlib import Path
import argparse,json,tempfile
from build_revision_slides import BASE,Runner,norm

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--weeks',type=int,nargs='+',default=list(range(5,13)))
    args=parser.parse_args()
    with tempfile.TemporaryDirectory(prefix='p1-revision-check-') as temp:
        runner=Runner(temp)
        for week in args.weeks:
            folder=BASE/f'revision-week-{week}'
            records=json.loads((folder/'checks.json').read_text())
            for case in records:
                path=folder/case['file']
                program={'lang':case['lang'],'release':case['release'],'code':path.read_text()}
                result=runner.run(program,case['stdin'],allow_failure=True)
                assert norm(result['stdout'])==norm(case['stdout']),(week,path,'stdout mismatch',result)
                assert result['returncode']==case['returncode'],(week,path,'exit status mismatch',result)
                assert result['error']==case['error'],(week,path,'exception mismatch',result)
            assert (folder/f'revision-week-{week}.pdf').is_file(),('Missing PDF',week)
            print(f'Week {week}: {len(records)} program cases match the recorded outcomes.',flush=True)
        print(f'{runner.runs} revision program cases verified.')

if __name__=='__main__':main()
